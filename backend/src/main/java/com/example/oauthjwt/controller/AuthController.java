package com.example.oauthjwt.controller;

import java.util.Map;

import com.example.oauthjwt.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.CustomUserDetailsService;
import com.example.oauthjwt.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;
  private final UserService userService;
  private final PasswordEncoder passwordEncoder;
  private final JWTUtil jwtUtil;
  private final CustomUserDetailsService customUserDetailsService;

  // ✅ 일반 회원가입 처리
  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) {
    Map<String, String> notExistsByEmailResult = userService.notExistsByEmail(userDTO.getEmail());
    if (!notExistsByEmailResult.isEmpty()) { // 이미 같은 이메일을 사용자가 존재하는 경우
      return ResponseEntity.badRequest()
              .body(notExistsByEmailResult); // 상태값은 의견 교환 후 변경 가능 200, 400 등
    }
    UserDTO result = userService.signup(userDTO);

    return ResponseEntity.ok(result);
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpServletResponse response) {
    UserDetails userDetails;
    try {
      userDetails = customUserDetailsService.loadUserByUsername(userDTO.getEmail());
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(Map.of("error", "Invalid email or password"));
    }
    if (!passwordEncoder.matches(userDTO.getPassword(), userDetails.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(Map.of("error", "Invalid email or password"));
    }
    String accessToken = jwtUtil.createJwt(
            userDetails.getUsername(),
            userDetails.getAuthorities().stream().findFirst().get().getAuthority(),
            15 * 60 * 1000L ); // ✅ Access Token (15분)
    String refreshToken = jwtUtil.createRefreshToken(
            userDetails.getUsername(), 7 * 24 * 60 * 60 * 1000L); // ✅ Refresh Token (7일)

    // response.addCookie(createAccessCookie(accessToken)); // 15분(주석 처리 이유: Local Storage에 저장)
    response.addCookie(createRefreshCookie(refreshToken)); // 7일

    return ResponseEntity.ok(Map.of(
            "message", "로그인 성공",
            "username", userDetails.getUsername(),
            "role", userDetails.getAuthorities().stream().findFirst().get().getAuthority(),
            "accessToken", accessToken,
            "refreshToken", refreshToken
    ));
  }

  // ✅ JWT 쿠키 삭제를 통한 로그아웃 처리
  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse response) {
    response.addCookie(createDeleteCookie("Authorization")); // ✅ Access Token 삭제
    response.addCookie(createDeleteCookie("Refresh")); // ✅ Refresh Token 삭제
    return ResponseEntity.ok("로그아웃 완료");
  }

  @PostMapping("/refresh")
  public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
    String refreshToken = jwtUtil.getTokenFromCookiesByName(request, "Refresh");

    if (refreshToken == null || jwtUtil.isExpired(refreshToken)) {
      return ResponseEntity.status(401)
              .body(ApiResponse.unauthorized("Refresh 토큰이 만료되었습니다."));
    }
    String usernameInToken = jwtUtil.getUsername(refreshToken);

    UserDetails userDetails;
    try {
      userDetails = customUserDetailsService.loadUserByUsername(usernameInToken);
    } catch (UsernameNotFoundException e) {
      return ResponseEntity.status(401)
              .body(ApiResponse.unauthorized("유효하지 않은 사용자입니다."));
    }
    if (!userDetails.getUsername().equals(usernameInToken)) {
      return ResponseEntity.status(403)
              .body(ApiResponse.forbidden("토큰 소유자 정보가 일치하지 않습니다."));
    }
    String newAccessToken = jwtUtil.createJwt(
            usernameInToken,
            userDetails.getAuthorities().stream().findFirst().get().getAuthority(),
            15 * 60 * 1000L
    );
//    response.addCookie(createAccessCookie(newAccessToken)); // 15분짜리만 갱신(주석 이유: Local Storage에 저장)

    // ✅ 토큰을 바디에 함께 반환
    return ResponseEntity.ok(
            Map.of(
                    "message", "Access 토큰 재발급 완료",
                    "accessToken", newAccessToken,
                    "status", true,
                    "code", 200
            )
    );
  }

  private Cookie createAccessCookie(String value) {
    Cookie cookie = new Cookie("Authorization", value);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(15 * 60); // 15분
    cookie.setAttribute("SameSite", "Lax");
    return cookie;
  }

  private Cookie createRefreshCookie(String value) {
    Cookie cookie = new Cookie("Refresh", value);
    cookie.setHttpOnly(true);
    cookie.setSecure(false);
    cookie.setPath("/");
    cookie.setMaxAge(7 * 24 * 60 * 60); // 7일
    cookie.setAttribute("SameSite", "Lax");
    return cookie;
  }

  private Cookie createDeleteCookie(String name) {
    Cookie cookie = new Cookie(name, null);
    cookie.setMaxAge(0);
    cookie.setPath("/");
    cookie.setHttpOnly(true);
    cookie.setSecure(false); // 배포 후 -> true(HTTPS 환경에서만 동작)
    cookie.setAttribute("SameSite", "Lax"); // 배포 후 -> None(CORS 허용 + 인증 유지)
    return cookie;
  }

  // HttpOnly 쿠키에 저장된 Access Token을 프론트엔드에서 사용하기 위해 꺼내오는 용도
  @GetMapping("/token")
  public ResponseEntity<?> getTokenFromCookie(HttpServletRequest request) {
    String token = jwtUtil.getTokenFromCookiesByName(request, "Authorization");
    if (token == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token found");
    }
    return ResponseEntity.ok(Map.of("token", token));
  }
}