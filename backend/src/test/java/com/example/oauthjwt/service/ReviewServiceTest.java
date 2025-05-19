package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.ReviewRequest;
import com.example.oauthjwt.dto.response.ReviewResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.entity.type.UserStatus;
import com.example.oauthjwt.repository.*;
import com.example.oauthjwt.service.impl.ReviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    private ReviewRepository reviewRepository;
    private ReviewTagRepository reviewTagRepository;
    private ProductRepository productRepository;
    private TransactionRepository transactionRepository;
    private RestTemplate restTemplate;
    private ReviewService reviewService;

    @BeforeEach
    void setUp() throws NoSuchFieldException, IllegalAccessException {
        reviewRepository = mock(ReviewRepository.class);
        reviewTagRepository = mock(ReviewTagRepository.class);
        productRepository = mock(ProductRepository.class);
        transactionRepository = mock(TransactionRepository.class);
        restTemplate = mock(RestTemplate.class); // 이걸 주입에도 사용해야 함

        reviewService = new ReviewServiceImpl(
                reviewRepository,
                reviewTagRepository,
                productRepository,
                transactionRepository
        );

        Field rtField = ReviewServiceImpl.class.getDeclaredField("restTemplate");
        rtField.setAccessible(true);
        rtField.set(reviewService, restTemplate);

        Field urlField = ReviewServiceImpl.class.getDeclaredField("flaskUrl");
        urlField.setAccessible(true);
        urlField.set(reviewService, "http://mock-flask-url/predict");
    }

    @Test
    @DisplayName("리뷰 작성 성공")
    void saveReview_success() {
        // given
        ReviewRequest request = new ReviewRequest();
        request.setText("정말 좋았어요!");
        request.setProductId(1L);
        request.setStars(5);
        request.setTransactionId(10L);

        User reviewer = User.builder()
                .id(100L)
                .name("tester")
                .role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .build();

        Product product = Product.builder()
                .id(1L)
                .title("테스트 상품")
                .build();

        Transaction transaction = Transaction.builder()
                .id(10L)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(transactionRepository.findById(10L)).thenReturn(Optional.of(transaction));

        Map<String, Object> mockFlaskResponse = Map.of(
                "sentiment", Map.of("result", "긍정"),
                "tags", List.of("친절해요", "재미있어요")
        );

        when(restTemplate.postForObject(anyString(), any(), ArgumentMatchers.<Class<Map>>any()))
                .thenReturn(mockFlaskResponse);

        when(reviewRepository.save(any())).thenAnswer(invocation -> {
            Review r = invocation.getArgument(0);
            r.setId(999L);
            return r;
        });

        // when
        ReviewResponse result = reviewService.saveReview(request, reviewer);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getRating()).isEqualTo(1);
        assertThat(result.getStars()).isEqualTo(5);
        assertThat(result.getTags()).containsExactly("친절해요", "재미있어요");

        verify(reviewRepository).save(any());
        verify(reviewTagRepository, times(2)).save(any());
    }
}
