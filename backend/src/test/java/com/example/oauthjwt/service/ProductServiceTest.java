package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.impl.ProductServiceImpl;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Optional;

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
    @Mock private ProductTagRepository productTagRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private User testUser;
    private Category testCategory;

    @BeforeEach
    void setup() {
        testUser = User.builder().id(1L).email("test@example.com").build();
        testCategory = Category.builder().id(1L).categoryName("TestCat").build();
    }

    @Test
    void saveProduct_Success() {
        // given
        ProductRequest request = ProductRequest.builder()
                .title("Test Product")
                .providerType("SELLER")
                .categoryId(1L)
                .address(new AddressRequest("12345", "Main Street", null, null))
                .images(Collections.emptyList())
                .tags(Collections.emptyList())
                .lat("37.1234")
                .lng("127.5678")
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        given(userRepository.findById(anyLong())).willReturn(Optional.of(testUser));
        given(categoryRepository.findById(anyLong())).willReturn(Optional.of(testCategory));
        given(addressRepository.save(any(Address.class))).willReturn(Address.of(request.getAddress()));

        Product dummyProduct = Product.builder()
                .id(1L)
                .title("Test Product")
                .hours(1)
                .providerType(ProviderType.parseProviderType("SELLER"))
                .address(Address.of(request.getAddress()))
                .owner(testUser)
                .category(testCategory)
                .build();

        given(productRepository.save(any(Product.class)))
                .willAnswer(invocation -> {
                    Product saved = invocation.getArgument(0);
                    saved.setId(1L);
                    saved.setLat("37.1234");
                    saved.setLng("127.5678");
                    return saved;
                });

        // when
        ProductResponse response = productService.save(request, userDetails);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Test Product");
    }

    @Test
    void saveProduct_InvalidUser_ThrowsException() {
        // given
        ProductRequest request = ProductRequest.builder()
                .title("Bad Product")
                .providerType("SELLER")
                .categoryId(1L)
                .address(new com.example.oauthjwt.dto.request.AddressRequest("12345", "Main Street", null, null))
                .lat("37.1234")
                .lng("127.5678")
                .build();

        given(userRepository.findById(anyLong())).willReturn(Optional.empty());
        CustomUserDetails badUser = new CustomUserDetails(User.builder().id(99L).build());

        // when & then
        assertThatThrownBy(() -> productService.save(request, badUser))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> {
                    ResponseStatusException ex = (ResponseStatusException) e;
                    assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
                });
    }
}
