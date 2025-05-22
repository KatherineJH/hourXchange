package com.example.oauthjwt.controller;

import java.util.Map;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.jwt.JWTUtil;
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

    // 일반 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid UserRequest userRequest) {
        // 서비스 호출
        UserResponse result = userService.signup(userRequest);
        // 반환
        return ResponseEntity.ok(result);
    }

    // 이메일 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@ModelAttribute @Valid UserRequest userRequest, HttpServletResponse response) {
        // 서비스 호출
        UserResponse result = userService.login(userRequest);
        // 토큰 생성
        String accessToken = jwtUtil.createToken(Map.of("email", result.getEmail()), ACCESS_TOKEN_TIME);
        String refreshToken = jwtUtil.createToken(Map.of("email", result.getEmail()), REFRESH_TOKEN_TIME);
        // 토큰 반환
        response.addCookie(jwtUtil.createCookie("Authorization", accessToken, ACCESS_TOKEN_TIME));
        response.addCookie(jwtUtil.createCookie("Refresh", refreshToken, REFRESH_TOKEN_TIME));
        // 반환
        return ResponseEntity.ok(result);
    }

    // JWT 쿠키 삭제를 통한 로그아웃 처리
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // 쿠키 생성
        Cookie emptyAccessCookie = jwtUtil.createCookie("Authorization", null, 0); // 엑세스 토큰
        Cookie emptyRefreshCookie = jwtUtil.createCookie("Refresh", null, 0); // 리프레쉬 토큰
        // 쿠키 반환
        response.addCookie(emptyAccessCookie);
        response.addCookie(emptyRefreshCookie);
        // 반환
        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }
    // 리프레쉬 토큰을 사용해 새로운 액세스 토큰 발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // 리프레쉬 쿠키 가져오기
        String refreshToken = jwtUtil.getTokenFromCookiesByName(request, "Refresh");
        String email = "";

        // 토큰의 클레임 값 가져오기
        Claims claims = jwtUtil.getClaims(refreshToken); // 여기서 토큰 검증도 같이 함
        // 클레임 중 email 값 가져오기
        email = claims.get("email", String.class);

        // 토큰에 이상이 없을 경우 가져온 email 값을 가지고 새로운 토큰을 생성
        String newAccessToken = jwtUtil.createToken(Map.of("email", email), ACCESS_TOKEN_TIME);
        // 토큰을 새로운 엑세스 쿠키로 반환
        response.addCookie(jwtUtil.createCookie("Authorization", newAccessToken, ACCESS_TOKEN_TIME));
        // 반환
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
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authorization = jwtUtil.getTokenFromCookiesByName(request, "Authorization");
        String email = "";
        try{

            Claims claims = jwtUtil.getClaims(authorization); // 여기서 토큰 검증도 같이 함

            email = claims.get("email", String.class);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }

        UserResponse result = userService.getUserByEmail(email);

        return ResponseEntity.ok(result);
    }
}
