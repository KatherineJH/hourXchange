package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.WalletHistoryResponse;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.WalletATM;
import com.example.oauthjwt.service.CustomUserDetails;
import com.example.oauthjwt.service.WalletService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WalletController.class)
class WalletControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WalletService walletService;

    @Test
    void 로그인_사용자의_지갑_히스토리_정상조회() throws Exception {
        // given
        Long userId = 1L;

        User user = User.builder()
                .id(userId)
                .email("test@example.com")
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(user);

        WalletHistoryResponse history = WalletHistoryResponse.builder()
                .id(1L)
                .amount(50)
                .type(WalletATM.EARN.name())
                .createdAt(LocalDateTime.now())
                .build();

        given(walletService.getWalletHistory(userId)).willReturn(List.of(history));

        // UsernamePasswordAuthenticationToken 사용해서 SecurityContext 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        // when & then
        mockMvc.perform(get("/api/wallet/history")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].amount").value(50))
                .andExpect(jsonPath("$[0].type").value("EARN"));
    }
}
