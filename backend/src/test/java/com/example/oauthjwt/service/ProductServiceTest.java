package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.dto.request.ProductRequest;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.ProviderType;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.entity.type.UserStatus;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    private ProductRepository productRepository;
    private UserRepository userRepository;
    private CategoryRepository categoryRepository;
    private SPImageRepository spImageRepository;
    private FavoriteRepository favoriteRepository;
    private ChatRoomRepository chatRoomRepository;
    private ReviewRepository reviewRepository;
    private AddressRepository addressRepository;
    private ProductService productService;

    @BeforeEach
    void setUp() {
        productRepository = mock(ProductRepository.class);
        userRepository = mock(UserRepository.class);
        categoryRepository = mock(CategoryRepository.class);
        spImageRepository = mock(SPImageRepository.class);
        favoriteRepository = mock(FavoriteRepository.class);
        chatRoomRepository = mock(ChatRoomRepository.class);
        reviewRepository = mock(ReviewRepository.class);
        addressRepository = mock(AddressRepository.class);

        productService = new ProductServiceImpl(
                productRepository,
                userRepository,
                categoryRepository,
                spImageRepository,
                favoriteRepository,
                chatRoomRepository,
                reviewRepository,
                addressRepository
        );
    }

    @Test
    @DisplayName("상품 저장 성공")
    void saveProduct_success() {
        // given
        ProductRequest request = ProductRequest.builder()
                .title("청소 도와드립니다")
                .description("2시간 청소 도와드려요")
                .hours(2)
                .startedAt(LocalDateTime.now())
                .endAt(LocalDateTime.now().plusHours(2))
                .lat("37.123")
                .lng("127.456")
                .ownerId(1L)
                .categoryId(2L)
                .providerType("SELLER")
                .address(new AddressRequest("서울시", "강남구", "역삼동", "101-202"))
                .images(List.of("https://example.com/image1.png"))
                .build();

        User owner = User.builder().id(1L).role(UserRole.ROLE_USER).status(UserStatus.ACTIVE).build();
        Category category = Category.builder().id(2L).build();
        Address address = Address.builder().id(1L).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category));
        when(spImageRepository.existsByImgUrl(anyString())).thenReturn(false);
        when(addressRepository.save(any(Address.class))).thenReturn(address);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        ProductResponse response = productService.save(request);

        // then
        assertThat(response.getTitle()).isEqualTo("청소 도와드립니다");
        assertThat(response.getDescription()).isEqualTo("2시간 청소 도와드려요");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("상품 조회 실패 - 존재하지 않음")
    void findById_fail_notFound() {
        // given
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // then
        assertThatThrownBy(() -> productService.findById(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("제품이 존재하지 않습니다");
    }
}

