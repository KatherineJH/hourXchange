package com.example.oauthjwt.controller;

import java.util.Map;

import com.example.oauthjwt.service.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.ApiResponse;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.repository.UserRepository;
//import com.example.oauthjwt.service.CustomUserDetailsService;
import com.example.oauthjwt.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import static com.example.oauthjwt.jwt.JWTUtil.ACCESS_TOKEN_TIME;
import static com.example.oauthjwt.jwt.JWTUtil.REFRESH_TOKEN_TIME;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Log4j2
public class AuthController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    // ✅ 일반 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid UserRequest userRequest) {

        UserResponse result = userService.signup(userRequest);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@ModelAttribute UserDTO userDTO, HttpServletResponse response) {
        UserResponse result = userService.login(userDTO);

        String accessToken = jwtUtil.createToken(result.getEmail(), ACCESS_TOKEN_TIME);
        String refreshToken = jwtUtil.createToken(result.getEmail(), REFRESH_TOKEN_TIME);

        response.addCookie(jwtUtil.createCookie("Authorization", accessToken, ACCESS_TOKEN_TIME));
        response.addCookie(jwtUtil.createCookie("Refresh", refreshToken, REFRESH_TOKEN_TIME));

        return ResponseEntity.ok(result);
    }

    // ✅ JWT 쿠키 삭제를 통한 로그아웃 처리
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie emptyAccessCookie = jwtUtil.createCookie("Authorization", null, 0); // 엑세스 토큰
        Cookie emptyRefreshCookie = jwtUtil.createCookie("Refresh", null, 0); // 리프레쉬 토큰

        response.addCookie(emptyAccessCookie);
        response.addCookie(emptyRefreshCookie);

        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtUtil.getTokenFromCookiesByName(request, "Refresh");

        String email = jwtUtil.getEmail(refreshToken); // 토큰 만료도 같이 검사 가능

        String newAccessToken = jwtUtil.createToken(email, ACCESS_TOKEN_TIME);

        response.addCookie(jwtUtil.createCookie("Authorization", newAccessToken, ACCESS_TOKEN_TIME));

        return ResponseEntity.ok(Map.of("message", "토큰 재발급 성공"));
    }

    /**
     * HttpOnly 쿠키에 저장된 JWT 토큰을 클라이언트가 직접 꺼내올 수 없기 때문에, 서버에게 토큰을 요청해서 JS 코드에서 사용 웹소켓
     * 연결, 로그인 후 /chat 페이지로 넘어갔을 때 토큰을 꺼내 STOMP 연결 등에서 사용.
     */
    @GetMapping("/token")
    public ResponseEntity<?> getTokenFromCookie(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromCookiesByName(request, "Authorization");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token found");
        }
        return ResponseEntity.ok(Map.of("token", token));
    }

    // 로그인된 사용자 정보 반환
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authorization = jwtUtil.getTokenFromCookiesByName(request, "Authorization");

        String email = jwtUtil.getEmail(authorization); // 토큰 만료도 같이 검사 가능

        UserResponse result = userService.getUserByEmail(email);

        return ResponseEntity.ok(result);
    }
}
