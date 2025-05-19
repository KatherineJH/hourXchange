package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.impl.DefaultClaims;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JWTUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("회원가입 성공")
    void signup_success() throws Exception {
        UserRequest userRequest = UserRequest.builder()
                .email("test@example.com")
                .username("tester")
                .password("password123")
                .build();

        UserResponse userResponse = UserResponse.builder()
                .email("test@example.com")
                .username("tester")
                .build();

        Mockito.when(userService.signup(any(UserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("로그인 성공")
    void login_success() throws Exception {
        UserDTO loginDTO = UserDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        UserResponse response = UserResponse.builder()
                .email("test@example.com")
                .username("tester")
                .build();

        Mockito.when(userService.login(any(UserDTO.class))).thenReturn(response);
        Mockito.when(jwtUtil.createToken(any(), (int) anyLong())).thenReturn("access-token").thenReturn("refresh-token");
        Mockito.when(jwtUtil.createCookie(any(), any(), (int) anyLong())).thenReturn(new Cookie("Authorization", "access-token"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("email", loginDTO.getEmail())
                        .param("password", loginDTO.getPassword()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("현재 로그인한 사용자 정보 조회")
    void getCurrentUser_success() throws Exception {
        Mockito.when(jwtUtil.getTokenFromCookiesByName(any(), any())).thenReturn("mock-token");

        Claims mockClaims = new DefaultClaims(Map.of("email", "test@example.com"));
        Mockito.when(jwtUtil.getClaims("mock-token")).thenReturn(mockClaims);

        UserResponse userResponse = UserResponse.builder()
                .email("test@example.com")
                .username("tester")
                .build();

        Mockito.when(userService.getUserByEmail("test@example.com")).thenReturn(userResponse);

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}