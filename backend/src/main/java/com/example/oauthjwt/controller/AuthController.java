package com.example.oauthjwt.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.example.oauthjwt.service.CustomUserDetailsService;
import com.example.oauthjwt.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Log4j2
public class AuthController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    // ✅ 일반 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid UserRequest userRequest) {
        log.info("Signup request: " + userRequest);

        UserResponse result = userService.signup(userRequest);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpServletResponse response) {
        UserDetails userDetails;
        try {
            userDetails = customUserDetailsService.loadUserByUsername(userDTO.getEmail());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }

        if (!passwordEncoder.matches(userDTO.getPassword(), userDetails.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }

        String accessToken = jwtUtil.createJwt(userDetails.getUsername(),
                userDetails.getAuthorities().stream().findFirst().get().getAuthority(), 15 * 60 * 1000L); // ✅ Access
        // Token (15분)

        String refreshToken = jwtUtil.createRefreshToken(userDetails.getUsername(), 7 * 24 * 60 * 60 * 1000L); // ✅
        // Refresh
        // Token
        // (7일)

        response.addCookie(createCookie("Authorization", accessToken, 15 * 60));
        response.addCookie(createCookie("Refresh", refreshToken, 7 * 24 * 60 * 60));

        return ResponseEntity.ok(Map.of("message", "로그인 성공", "username", userDetails.getUsername(), "role",
                userDetails.getAuthorities().stream().findFirst().get().getAuthority(), "accessToken", accessToken,
                "refreshToken", refreshToken));
    }

    private Cookie createCookie(String key, String value, int maxAgeInSeconds) {
        Cookie cookie = new Cookie(key, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 배포 후 -> true(HTTPS 환경에서만 동작)
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeInSeconds);
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }

    // ✅ JWT 쿠키 삭제를 통한 로그아웃 처리
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // ✅ Access Token 삭제
        Cookie accessToken = new Cookie("Authorization", null);
        accessToken.setMaxAge(0);
        accessToken.setPath("/");
        accessToken.setHttpOnly(true);
        accessToken.setSecure(false); // 배포 후 -> true(HTTPS 환경에서만 동작)
        accessToken.setAttribute("SameSite", "Lax"); // 배포 후 -> None(CORS 허용 + 인증 유지)
        response.addCookie(accessToken);

        // ✅ Refresh Token 삭제
        Cookie refreshToken = new Cookie("Refresh", null);
        refreshToken.setMaxAge(0);
        refreshToken.setPath("/");
        refreshToken.setHttpOnly(true);
        refreshToken.setSecure(false); // 배포 후 -> true(HTTPS 환경에서만 동작)
        refreshToken.setAttribute("SameSite", "Lax"); // 배포 후 -> None(CORS 허용 + 인증 유지)
        response.addCookie(refreshToken);

        return ResponseEntity.ok("로그아웃 완료");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtUtil.getTokenFromCookiesByName(request, "Refresh");

        if (refreshToken == null || jwtUtil.isExpired(refreshToken)) {
            return ResponseEntity.status(401).body(ApiResponse.unauthorized("Refresh 토큰이 만료되었습니다."));
        }

        String usernameInToken = jwtUtil.getUsername(refreshToken);

        UserDetails userDetails;
        try {
            userDetails = customUserDetailsService.loadUserByUsername(usernameInToken);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(401).body(ApiResponse.unauthorized("유효하지 않은 사용자입니다."));
        }

        if (!userDetails.getUsername().equals(usernameInToken)) {
            return ResponseEntity.status(403).body(ApiResponse.forbidden("토큰 소유자 정보가 일치하지 않습니다."));
        }

        String newAccessToken = jwtUtil.createJwt(usernameInToken,
                userDetails.getAuthorities().stream().findFirst().get().getAuthority(), 15 * 60 * 1000L);

        response.addCookie(createCookie("Authorization", newAccessToken, 15 * 60));

        // ✅ 토큰을 바디에도 함께 반환
        return ResponseEntity
                .ok(Map.of("message", "Access 토큰 재발급 완료", "accessToken", newAccessToken, "status", true, "code", 200));
    }

    /**
     * HttpOnly 쿠키에 저장된 JWT 토큰을 클라이언트가 직접 꺼내올 수 없기 때문에, 서버에게 토큰을 요청해서 JS 코드에서 사용 웹소켓
     * 연결, 로그인 후 /chat 페이지로 넘어갔을 때 토큰을 꺼내 STOMP 연결 등에서 사용.
     */
    @GetMapping("/token")
    public ResponseEntity<?> getTokenFromCookie(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromCookies(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token found");
        }
        return ResponseEntity.ok(Map.of("token", token));
    }
}
