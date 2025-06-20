package com.example.oauthjwt.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.example.oauthjwt.TestSecurityConfig;
import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.interceptor.VisitLogInterceptor;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.service.UserService;
import com.example.oauthjwt.service.impl.CustomOAuth2UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.impl.DefaultClaims;
import jakarta.servlet.http.Cookie;

/**
 * AuthControllerTest는 인증 및 사용자 관련 HTTP 요청을 처리하는 AuthController의 동작을 검증. Spring의
 * MockMvc와 Mockito를 활용하여 컨트롤러 계층만 독립적으로 테스트.
 */
@WebMvcTest(AuthController.class)
@Import(TestSecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JWTUtil jwtUtil;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private CustomOAuth2UserService customOAuth2UserService;

    @MockBean
    private VisitLogInterceptor visitLogInterceptor;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 1. 회원가입 성공 (signup_success) - JSON 형식의 POST 요청을 /api/auth/signup 엔드포인트로 전송한다.
     * - UserService.signup()이 정상적으로 동작하면 200 OK 상태코드와 함께 응답 JSON에 email이 포함된다.
     */
    @Test
    @DisplayName("회원가입 성공")
    void signup_success() throws Exception {
        UserRequest userRequest = UserRequest.builder().email("test@example.com").username("tester").name("테스트이름") // 추가
                .password("password123").birthdate(LocalDate.of(2000, 1, 1)) // 추가
                .address(new AddressRequest("서울시", "강남구", "역삼동", "101-202")) // 추가
                .build();

        UserResponse userResponse = UserResponse.builder().id(1L).email("test@example.com").name("테스트이름")
                .username("tester").birthdate(LocalDate.of(2000, 1, 1)).role("ROLE_USER").status("ACTIVE")
                .createdAt(LocalDateTime.now()).wallet(null).address(null).build();

        Mockito.when(userService.signup(any(UserRequest.class))).thenReturn(userResponse);

        mockMvc.perform(post("/api/auth/signup").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequest))).andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    /**
     * 2. 로그인 성공 (login_success) - 폼 방식의 POST 요청을 /api/auth/login 엔드포인트로 전송한다. -
     * UserService.login() 성공 후 JWT 토큰 생성 및 쿠키 반환 흐름을 검증한다. - 응답 결과로 200 OK와 함께 로그인한
     * 유저의 email이 반환되어야 한다.
     */
    @Test
    @DisplayName("로그인 성공")
    void login_success() throws Exception {
        UserRequest loginRequest = UserRequest.builder().email("test@example.com").password("password123").build();

        UserResponse userResponse = UserResponse.builder().id(1L).email("test@example.com").name("테스트이름")
                .username("tester").birthdate(LocalDate.of(2000, 1, 1)).role("ROLE_USER").status("ACTIVE")
                .createdAt(LocalDateTime.now()).wallet(null).address(null).build();

        Mockito.when(userService.login(any(UserRequest.class))).thenReturn(userResponse);
        Mockito.when(jwtUtil.createToken(eq(Map.of("email", "test@example.com")), anyInt())).thenReturn("access-token");
        Mockito.when(jwtUtil.createToken(eq(Map.of("email", "test@example.com")), eq(60 * 60 * 24 * 7)))
                .thenReturn("refresh-token");

        Mockito.when(jwtUtil.createCookie(eq("Authorization"), anyString(), anyInt()))
                .thenReturn(new Cookie("Authorization", "access-token"));
        Mockito.when(jwtUtil.createCookie(eq("Refresh"), anyString(), anyInt()))
                .thenReturn(new Cookie("Refresh", "refresh-token"));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))).andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    /**
     * 3. 현재 로그인한 사용자 정보 조회 (getCurrentUser_success) - /api/auth/me 엔드포인트에 GET 요청을
     * 보낸다. - 쿠키에서 JWT를 추출하고, JWTUtil로 이메일 정보를 얻어 사용자 정보를 반환받는다. - 결과적으로 응답 JSON에
     * 이메일이 포함되어야 하며 상태코드는 200 OK이다.
     */
    @Test
    @DisplayName("현재 로그인한 사용자 정보 조회")
    void getCurrentUser_success() throws Exception {
        Mockito.when(jwtUtil.getTokenFromCookiesByName(any(), any())).thenReturn("mock-token");

        Claims mockClaims = new DefaultClaims(Map.of("email", "test@example.com"));
        Mockito.when(jwtUtil.getClaims("mock-token")).thenReturn(mockClaims);

        UserResponse userResponse = UserResponse.builder().id(1L).email("test@example.com").name("테스트이름")
                .username("tester").birthdate(LocalDate.of(2000, 1, 1)).role("ROLE_USER").status("ACTIVE")
                .createdAt(LocalDateTime.now()).wallet(null).address(null).build();

        Mockito.when(userService.getUserByEmail("test@example.com")).thenReturn(userResponse);

        mockMvc.perform(get("/api/auth/me")).andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}
