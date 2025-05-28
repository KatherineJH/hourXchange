package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.example.oauthjwt.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private ProductImageRepository productImageRepository;
    @Mock private FavoriteRepository favoriteRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private AddressRepository addressRepository;
    @Mock private StringRedisTemplate stringRedisTemplate;

    @InjectMocks private ProductServiceImpl productService;

    private ProductRequest makeProductRequest() {
        return ProductRequest.builder()
                .title("테스트상품")
                .description("설명")
                .hours(2)
                .startedAt(LocalDateTime.now().plusDays(1))
                .endAt(LocalDateTime.now().plusDays(2))
                .categoryId(3L)
                .providerType("SELLER") // ProviderType.SELLER로 변경!
                .images(List.of("img1.png"))
                .lat("37.5")
                .lng("127.0")
                .address(null)
                .build();
    }

    @Test
    @DisplayName("save: 정상 저장 및 DTO 반환")
    void save_Success() {
        // given
        ProductRequest req = makeProductRequest();
        User owner = new User(); owner.setId(1L);
        Category cat = new Category(); cat.setId(3L);
        Address address = new Address(); address.setId(8L);

        CustomUserDetails userDetails = new CustomUserDetails(owner);
        given(userRepository.findById(1L)).willReturn(Optional.of(owner));
        given(categoryRepository.findById(3L)).willReturn(Optional.of(cat));
        given(productImageRepository.existsByImgUrl("img1.png")).willReturn(false);
        given(addressRepository.save(any(Address.class))).willReturn(address);

        // (1) setId(10L) 대신 빌더로 새로운 Product 객체 반환
        given(productRepository.save(any(Product.class))).willAnswer(inv -> {
            Product p = inv.getArgument(0);
            // id 필드가 final이 아니고, @Setter 가 있으면 가능
            try {
                var field = Product.class.getDeclaredField("id");
                field.setAccessible(true);
                field.set(p, 10L);
            } catch (Exception ignored) {}
            return p;
        });

        // when
        ProductResponse res = productService.save(req, userDetails);

        // then
        assertThat(res.getId()).isEqualTo(10L);
        assertThat(res.getTitle()).isEqualTo("테스트상품");
        assertThat(res.getCategory().getId()).isEqualTo(3L);
        then(productRepository).should().save(any(Product.class));
    }

    @Test
    @DisplayName("save: 중복 이미지 주소 예외")
    void save_DuplicateImage() {
        ProductRequest req = makeProductRequest();
        User owner = new User(); owner.setId(1L);
        Category cat = new Category(); cat.setId(3L);

        CustomUserDetails userDetails = new CustomUserDetails(owner);
        given(userRepository.findById(1L)).willReturn(Optional.of(owner));
        given(categoryRepository.findById(3L)).willReturn(Optional.of(cat));
        given(productImageRepository.existsByImgUrl("img1.png")).willReturn(true);

        assertThatThrownBy(() -> productService.save(req, userDetails))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                });
    }

    @Test
    @DisplayName("findById: 캐시 없을 때 viewCount 증가 및 반환")
    void findById_increaseViewCount() {
        // given
        Product product = Product.builder()
                .id(100L).title("t").description("d")
                .owner(new User()).category(new Category())
                .providerType(ProviderType.SELLER)
                .lat("0").lng("0")
                .startedAt(LocalDateTime.now())
                .endAt(LocalDateTime.now().plusDays(1))
                .address(new Address())
                .createdAt(LocalDateTime.now())
                .images(new ArrayList<>())
                .favoriteList(new ArrayList<>())
                .chatRooms(new ArrayList<>())
                .reviews(new ArrayList<>())
                .transactions(new ArrayList<>())
                .viewCount(0)
                .build();

        given(productRepository.findById(100L)).willReturn(Optional.of(product));
        given(stringRedisTemplate.hasKey(anyString())).willReturn(false);

        // when
        ProductResponse res = productService.findById(100L, "userKey1");

        // then
        assertThat(res.getId()).isEqualTo(100L);
        then(productRepository).should().save(any(Product.class));
    }

    @Test
    @DisplayName("update: 정상 수정")
    void update_Success() {
        // given
        ProductRequest req = makeProductRequest();
        User owner = new User(); owner.setId(1L);
        Category cat = new Category(); cat.setId(3L);
        Address address = new Address(); address.setId(8L);
        Product product = Product.builder()
                .id(100L)
                .owner(owner)
                .category(cat)
                .providerType(ProviderType.SELLER)
                .address(address)
                .images(new ArrayList<>())
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(owner);
        given(productRepository.findById(100L)).willReturn(Optional.of(product));
        given(categoryRepository.findById(3L)).willReturn(Optional.of(cat));
        // (2) deleteAllByProductId가 void이면 doNothing() 사용, int 반환이면 아래 그대로 사용
        doNothing().when(productImageRepository).deleteAllByProductId(100L);
        given(productImageRepository.existsByImgUrl("img1.png")).willReturn(false);
        given(productRepository.save(any(Product.class))).willAnswer(inv -> inv.getArgument(0));

        // when
        ProductResponse res = productService.update(req, userDetails, 100L);

        // then
        assertThat(res.getId()).isEqualTo(100L);
        assertThat(res.getTitle()).isEqualTo("테스트상품");
        then(productRepository).should().save(any(Product.class));
    }

    @Test
    @DisplayName("update: 본인 소유가 아니면 예외")
    void update_Forbidden() {
        ProductRequest req = makeProductRequest();
        User owner = new User(); owner.setId(1L);
        User other = new User(); other.setId(2L);
        Category cat = new Category(); cat.setId(3L);
        Address address = new Address(); address.setId(8L);
        Product product = Product.builder()
                .id(100L)
                .owner(other) // 다른 사람 소유
                .category(cat)
                .providerType(ProviderType.SELLER)
                .address(address)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(owner);
        given(productRepository.findById(100L)).willReturn(Optional.of(product));

        assertThatThrownBy(() -> productService.update(req, userDetails, 100L))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN));
    }
}
