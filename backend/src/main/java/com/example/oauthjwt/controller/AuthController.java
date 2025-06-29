package com.example.oauthjwt.controller;

import static com.example.oauthjwt.jwt.JWTUtil.ACCESS_TOKEN_TIME;
import static com.example.oauthjwt.jwt.JWTUtil.REFRESH_TOKEN_TIME;

import java.net.URI;
import java.util.Map;

import com.example.oauthjwt.util.LocationUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.request.ChangePasswordRequest;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.service.UserService;
import com.example.oauthjwt.service.impl.CustomUserDetails;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Log4j2
public class AuthController {

    private final UserService userService;
    private final JWTUtil jwtUtil;
    private final LocationUtil locationUtil;

    // 일반 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@RequestBody @Valid UserRequest userRequest) {
        // 서비스 호출
        UserResponse result = userService.signup(userRequest);
        // 반환
        return ResponseEntity.created(locationUtil.createdLocationWithUrl(result.getId(), "/api/user")).body(result);
    }

    // 이메일 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@ModelAttribute @Valid UserRequest userRequest,
            HttpServletResponse response) {
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
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
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
    public ResponseEntity<Map<String, String>> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
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
        } catch (Exception e) {
            // 쿠키 생성
            Cookie emptyAccessCookie = jwtUtil.createCookie("Authorization", null, 0); // 엑세스 토큰
            Cookie emptyRefreshCookie = jwtUtil.createCookie("Refresh", null, 0); // 리프레쉬 토큰
            // 쿠키 반환
            response.addCookie(emptyAccessCookie);
            response.addCookie(emptyRefreshCookie);
            return ResponseEntity.ok(Map.of("message", "사용자 정보를 찾을 수 없습니다."));
        }

    }

    /**
     * HttpOnly 쿠키에 저장된 JWT 토큰을 클라이언트가 직접 꺼내올 수 없기 때문에, 서버에게 토큰을 요청해서 JS 코드에서 사용 웹소켓
     * 연결, 로그인 후 /chat 페이지로 넘어갔을 때 토큰을 꺼내 STOMP 연결 등에서 사용.
     */
    // 사용자 토큰 요청
    @GetMapping("/token")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> getTokenFromCookie(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromCookiesByName(request, "Authorization");

        return ResponseEntity.ok(Map.of("token", token));
    }

    // 로그인된 사용자 정보 반환
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request, HttpServletResponse response) {
        try {
            String authorization = jwtUtil.getTokenFromCookiesByName(request, "Authorization");

            Claims claims = jwtUtil.getClaims(authorization); // 여기서 토큰 검증도 같이 함
            UserResponse result = userService.getUserByEmail(claims.get("email", String.class));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // 쿠키 생성
            Cookie emptyAccessCookie = jwtUtil.createCookie("Authorization", null, 0); // 엑세스 토큰
            Cookie emptyRefreshCookie = jwtUtil.createCookie("Refresh", null, 0); // 리프레쉬 토큰
            // 쿠키 반환
            response.addCookie(emptyAccessCookie);
            response.addCookie(emptyRefreshCookie);
            return ResponseEntity.ok(Map.of("message", "사용자 정보를 찾을 수 없습니다."));
        }
    }

    @PutMapping("/password")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUser().getId();
        userService.changePasswordWithoutOld(userId, request.getNewPassword(), request.getConfirmPassword());

        return ResponseEntity.ok(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
    }

    /**
     * 나중에 반드시 제거해야 할 API 절차 없이 비밀번호 변경이 가능한 컨트롤러.
     */
    @PutMapping("/dev/password")
    public ResponseEntity<?> devChangePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (email == null || newPassword == null || confirmPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email, newPassword, confirmPassword가 필요합니다."));
        }
        try {
            Long userId = userService.getUserByEmail(email).getId();
            userService.changePasswordWithoutOld(userId, newPassword, confirmPassword);
            return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
