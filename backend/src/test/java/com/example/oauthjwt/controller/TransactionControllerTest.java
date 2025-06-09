package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.request.TransactionRequest;
import com.example.oauthjwt.dto.response.ProductResponse;
import com.example.oauthjwt.dto.response.TransactionResponse;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.entity.Product;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.interceptor.VisitLogInterceptor;
import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.example.oauthjwt.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @MockBean
    private VisitLogInterceptor visitLogInterceptor;

    @Autowired
    private ObjectMapper objectMapper;

    // Helper method to create mock CustomUserDetails
    private CustomUserDetails mockUserDetails(Long userId) {
        User user = User.builder()
                .id(userId)
                .email("mock@user.com")
                .password("password")
                .role(UserRole.ROLE_USER)
                .build();
        return new CustomUserDetails(user);
    }

    // Helper method to create mock TransactionResponse
    private TransactionResponse mockTransactionResponse(Long id, Long userId, Long productId, String status, Long chatRoomId) {
        return TransactionResponse.builder()
                .id(id)
                .user(UserResponse.toDto(User.builder().id(userId).email("mock@user.com").build()))
                .product(ProductResponse.toDto(Product.builder().id(productId).title("Test Product").build()))
                .status(status)
                .createdAt(LocalDateTime.now())
                .chatRoomId(chatRoomId)
                .reviewId(null)
                .build();
    }

    @Test
    @DisplayName("트랜잭션 생성 성공")
    void save_shouldCreateTransaction() throws Exception {
        // given
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .productId(1L)
                .status("PENDING")
                .build();

        TransactionResponse mockResponse = mockTransactionResponse(1L, userId, 1L, "PENDING", 1L);

        when(transactionService.save(any(TransactionRequest.class))).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(post("/api/transaction/")
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transactionRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.user.id").value(userId))
                .andExpect(jsonPath("$.product.id").value(1L))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.chatRoomId").value(1L));
    }

    @Test
    @DisplayName("트랜잭션 단건 조회 성공")
    void findById_shouldReturnTransaction() throws Exception {
        // given
        Long transactionId = 1L;
        TransactionResponse mockResponse = mockTransactionResponse(transactionId, 100L, 1L, "PENDING", 1L);

        when(transactionService.findById(transactionId)).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(get("/api/transaction/{id}", transactionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(transactionId))
                .andExpect(jsonPath("$.user.id").value(100L))
                .andExpect(jsonPath("$.product.id").value(1L))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.chatRoomId").value(1L));
    }

    @Test
    @DisplayName("전체 트랜잭션 조회 성공")
    void findAll_shouldReturnTransactionList() throws Exception {
        // given
        TransactionResponse transaction1 = mockTransactionResponse(1L, 100L, 1L, "PENDING", 1L);
        TransactionResponse transaction2 = mockTransactionResponse(2L, 101L, 2L, "ACCEPTED", 2L);

        List<TransactionResponse> mockList = Arrays.asList(transaction1, transaction2);
        Page<TransactionResponse> mockPage = new PageImpl<>(mockList);

        when(transactionService.findAll(any(Pageable.class))).thenReturn(mockPage);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(get("/api/transaction/list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].status").value("PENDING"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].status").value("ACCEPTED"));
    }

    @Test
    @DisplayName("내 트랜잭션 조회 성공")
    void findMyTransactions_shouldReturnMyTransactions() throws Exception {
        // given
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        TransactionResponse transaction = mockTransactionResponse(1L, 101L, 1L, "PENDING", 1L); // Opponent userId: 101L

        List<TransactionResponse> mockList = Arrays.asList(transaction);

        when(transactionService.findByUserId(userId)).thenReturn(mockList);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(get("/api/transaction/my")
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].user.id").value(101L)) // Opponent user
                .andExpect(jsonPath("$[0].product.id").value(1L))
                .andExpect(jsonPath("$[0].status").value("PENDING"))
                .andExpect(jsonPath("$[0].chatRoomId").value(1L));
    }

    @Test
    @DisplayName("트랜잭션 수정 성공")
    void update_shouldUpdateTransaction() throws Exception {
        // given
        Long transactionId = 1L;
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .productId(1L)
                .status("ACCEPTED")
                .build();

        TransactionResponse mockResponse = mockTransactionResponse(transactionId, userId, 1L, "ACCEPTED", 1L);

        when(transactionService.update(any(TransactionRequest.class))).thenReturn(mockResponse);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(put("/api/transaction/{id}", transactionId)
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transactionRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(transactionId))
                .andExpect(jsonPath("$.user.id").value(userId))
                .andExpect(jsonPath("$.product.id").value(1L))
                .andExpect(jsonPath("$.status").value("ACCEPTED"))
                .andExpect(jsonPath("$.chatRoomId").value(1L));
    }

    @Test
    @DisplayName("트랜잭션 완료 성공")
    void complete_shouldCompleteTransaction() throws Exception {
        // given
        Long transactionId = 1L;
        doNothing().when(transactionService).completeTransaction(transactionId);
        when(visitLogInterceptor.preHandle(any(), any(), any())).thenReturn(true);

        // when & then
        mockMvc.perform(patch("/api/transaction/complete/{transactionId}", transactionId)
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string("\"거래가 완료되었습니다.\""));
    }

    @Test
    @DisplayName("트랜잭션 생성 실패 - 필수 필드 누락")
    void save_shouldFailWhenRequiredFieldsAreMissing() throws Exception {
        // given
        Long userId = 100L;
        CustomUserDetails userDetails = mockUserDetails(userId);

        TransactionRequest transactionRequest = TransactionRequest.builder().build(); // Missing productId, status

        // when & then
        mockMvc.perform(post("/api/transaction/")
                        .with(SecurityMockMvcRequestPostProcessors.user(userDetails))
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(transactionRequest)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.validationErrors.productId").value("제품 정보는 필수입니다."))
                .andExpect(jsonPath("$.validationErrors.status").value("상태 정보는 필수입니다."));
    }
}