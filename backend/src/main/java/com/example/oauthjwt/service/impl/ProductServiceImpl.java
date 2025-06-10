package com.example.oauthjwt.service.impl;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.FavoriteResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
@CacheConfig(cacheNames = {"productFindAll"})
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final FavoriteRepository favoriteRepository;
    private final ReviewRepository reviewRepository;
    private final AddressRepository addressRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final ProductTagRepository productTagRepository;

    @CacheEvict(cacheNames = {"productFindAll", "searchProducts"}, allEntries = true)
    public ProductResponse save(ProductRequest productRequest, CustomUserDetails userDetails) {
        // 유저 검증
        User owner = userRepository.findById(userDetails.getUser().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        // 카테고리 검증
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));
        // ProviderType 검증
        ProviderType providerType = ProviderType.parseProviderType(productRequest.getProviderType().toUpperCase());
        if (providerType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
        }
        // 이미지 리스트 생성
        List<ProductImage> images = new ArrayList<>();
        if (productRequest.getImages() != null && !productRequest.getImages().isEmpty()) {
            for (String url : productRequest.getImages()) {
                if (productImageRepository.existsByImgUrl(url)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미지 주소가 중복되었습니다.");
                }
                images.add(ProductImage.builder().imgUrl(url).build());
            }
        }
        // Product 객체 생성 (tags 포함)
        Product product = Product.of(productRequest, owner, category, providerType, images, productRequest.getTags());
        // 저장 및 반환
        Product result = productRepository.save(product);
        return ProductResponse.toDto(result);
    }

    @Override
    public ProductResponse findById(Long productId, String userKey) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));

        String key = "view productId: " + productId + ", by: " + userKey;

        Boolean alreadyExists = stringRedisTemplate.hasKey(key);
        if (!alreadyExists) { // 존재하지 않으면
            log.info("캐싱");
            // 뷰 카운트 증가
            productRepository.save(product.addViewCount());
            // 24시간 TTL로 기록
            stringRedisTemplate.opsForValue().set(key, "1", Duration.ofHours(24));
        }
        log.info("무시");

        return ProductResponse.toDto(product);
    }

    @Transactional
    @CacheEvict(cacheNames = {"productFindAll", "searchProducts"}, allEntries = true)
    public ProductResponse update(ProductRequest productRequest, CustomUserDetails userDetails, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));

        if (!product.getOwner().getId().equals(userDetails.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신이 등록한 제품만 수정이 가능합니다.");
        }

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));

        ProviderType providerType = ProviderType.parseProviderType(productRequest.getProviderType().toUpperCase());
        if (providerType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
        }

        // 이미지 업데이트
        List<ProductImage> images = new ArrayList<>();
        if (productRequest.getImages() != null && !productRequest.getImages().isEmpty()) {
            productImageRepository.deleteAllByProductId(product.getId());
            for (String url : productRequest.getImages()) {
                if (productImageRepository.existsByImgUrl(url)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미지 주소가 중복되었습니다.");
                }
                if (url != null && !url.isEmpty()) {
                    images.add(ProductImage.builder().imgUrl(url).product(product).build());
                }
            }
        }

        productTagRepository.deleteAllByProductId(product.getId());
        product.getProductTags().clear();

        // 새로운 태그 추가
        if (productRequest.getTags() != null && !productRequest.getTags().isEmpty()) {
            List<ProductTag> updatedTags = productRequest.getTags().stream().limit(5)
                    .map(tag -> ProductTag.builder().product(product).productTag(tag).build())
                    .collect(Collectors.toList());
            product.getProductTags().addAll(updatedTags);
        }

        // 저장 및 반환
        Product result = productRepository.save(product.setUpdateValue(productRequest, category, providerType, images));
        return ProductResponse.toDto(result);
    }

    @Override
    @Cacheable(cacheNames = "productFindAll", key = "#page + ':' + #size")
    public PageResult<ProductResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()); // 최신순 정렬
        Page<Product> productPage = productRepository.findAll(pageable);

        List<ProductResponse> content = productPage.getContent().stream().map(product -> {
            double starsAverage = reviewRepository.getAverageStarsByOwner(product.getOwner()); // 판매자 기준 // 매번 조회 시 점점
                                                                                               // 느려질 것 같습니다.

            return ProductResponse.toDto(product, starsAverage);
        }).collect(Collectors.toList());

        return new PageResult<>(content, productPage.getNumber(), productPage.getSize(), productPage.getTotalElements(),
                productPage.getTotalPages());
    }

    @Override
    public Page<ProductResponse> getFilteredList(int page, int size, ProviderType providerType) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (providerType != null) {
            return productRepository.findByProviderType(providerType, pageable).map(ProductResponse::toDto);
        } else {
            return productRepository.findAll(pageable).map(ProductResponse::toDto);
        }
    }

    @Override
    public List<ProductResponse> findAllWithPosition(double swLat, double swLng, double neLat, double neLng) {
        List<Product> productList = productRepository.findAllWithPosition(swLat, swLng, neLat, neLng);
        return productList.stream().map(ProductResponse::toDto).collect(Collectors.toList());
    }

    @Override
    public FavoriteResponse toggleFavorite(Long productId, Long userId) {
        // 검증
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        Optional<Favorite> prevFavorite = favoriteRepository.findByUserAndProduct(user, product);
        if (prevFavorite.isPresent()) {
            prevFavorite.get().toggle();
            favoriteRepository.save(prevFavorite.get());
            return FavoriteResponse.toDto(prevFavorite.get());
        }

        Favorite favorite = Favorite.of(product, user);

        FavoriteResponse result = FavoriteResponse.toDto(favoriteRepository.save(favorite));

        return result;
    }

    @Override
    public List<FavoriteResponse> findAllFavorite(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        List<Favorite> favoriteList = favoriteRepository.findByUserAndStatus(user, true);

        return favoriteList.stream().map(FavoriteResponse::toDto).collect(Collectors.toList());
    }

    @Override
    public Page<ProductResponse> findByOwnerId(Long ownerId, Pageable pageable) {
        Page<Product> products = productRepository.findByOwnerId(ownerId, pageable);
        return products.map(product -> {
            double starsAverage = reviewRepository.getAverageStarsByOwner(product.getOwner());
            return ProductResponse.toDto(product, starsAverage);
        });
    }

    @Override
    public ProductResponse delete(CustomUserDetails userDetails, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));
        if (!product.getOwner().getId().equals(userDetails.getUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신이 등록한 제품만 삭제가 가능합니다.");
        }
        product.setDelete();

        return ProductResponse.toDto(productRepository.save(product));
    }
}
