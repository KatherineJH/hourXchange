package com.example.oauthjwt.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.FavoriteResponse;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SPImageRepository spImageRepository;
    private final FavoriteRepository favoriteRepository;

    public ProductResponse save(ProductRequest productRequest) {
        // 검증
        User owner = userRepository.findById(productRequest.getOwnerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));

        ProviderType providerType = ProviderType.parseProviderType(productRequest.getProviderType().toUpperCase());
        if (providerType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
        }
        // 이미지 리스트 생성
        List<SPImage> images = new ArrayList<>();
        if (productRequest.getImages() != null && !productRequest.getImages().isEmpty()) { // 이미지가 있는 경우에만 등록
            for (String url : productRequest.getImages()) { // 이미지 url list 등록
                if (spImageRepository.existsByImgUrl(url)) {
                    log.info("이미지 주소 중복");
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 주소가 중복되었습니다.");
                }
                SPImage spImage = SPImage.builder().imgUrl(url).build();

                images.add(spImage);
            }
        }
        // 저장할 객체 생성
        Product product = Product.of(productRequest, owner, category, providerType, images);
        // 저장 후 결과 반환
        Product result = productRepository.save(product);
        return ProductResponse.toDto(result);
    }

    @Override
    public ProductResponse findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));
        product = product.addViewCount();
        productRepository.save(product);
        return ProductResponse.toDto(product);
    }

    @Override
    @Transactional
    public ProductResponse update(ProductRequest productRequest) {
        // 검증
        Product product = productRepository.findById(productRequest.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));

        ProviderType providerType = ProviderType.parseProviderType(productRequest.getProviderType().toUpperCase());
        if (providerType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
        }
        // 이미지 리스트 생성
        List<SPImage> images = new ArrayList<>();
        if (productRequest.getImages() != null && !productRequest.getImages().isEmpty()) { // 이미지가 있는 경우에만 등록

            spImageRepository.deleteAllByProductId(product.getId()); // 원래 이미지 삭제

            for (String url : productRequest.getImages()) { // 이미지 url list 등록

                if (spImageRepository.existsByImgUrl(url)) { // 이미 존재하는 주소면
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 주소가 중복되었습니다.");
                }
                if (url != null && !url.isEmpty()) { // 이미지 주소가 있으면
                    SPImage spImage = SPImage.builder().imgUrl(url).product(product).build();
                    images.add(spImage);
                }
            }
        }
        // 저장 및 반환
        Product result = productRepository.save(product.setUpdateValue(productRequest, category, providerType, images));
        return ProductResponse.toDto(result);
    }

    @Override
    public Page<ProductResponse> findAll(Pageable pageable) {
        Page<Product> productList = productRepository.findAll(pageable);
        return productList.map(ProductResponse::toDto);
    }

    @Override
    public List<ProductResponse> findAllWithPosition(double lat, double lng) {
        List<Product> productList = productRepository.findNearby1Km(lat, lng);
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
}
