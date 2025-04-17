package com.example.oauthjwt.controller;

import java.util.Map;

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
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
    }

    if (!passwordEncoder.matches(userDTO.getPassword(), userDetails.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
    }

    String token =
        jwtUtil.createJwt(
            userDetails.getUsername(),
            userDetails.getAuthorities().stream().findFirst().get().getAuthority(),
            60 * 60 * 1000L);

    Cookie cookie = new Cookie("Authorization", token);
    cookie.setPath("/");
    cookie.setMaxAge(3600);
    cookie.setHttpOnly(true);
    response.addCookie(cookie);

    return ResponseEntity.ok(
        Map.of(
            "message",
            "로그인 성공",
            "username",
            userDetails.getUsername(),
            "role",
            userDetails.getAuthorities().stream().findFirst().get().getAuthority(),
            "token",
            token));
  }

  // ✅ JWT 쿠키 삭제를 통한 로그아웃 처리
  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse response) {
    Cookie cookie = new Cookie("Authorization", null);
    cookie.setMaxAge(0); // 즉시 만료
    cookie.setPath("/"); // 반드시 동일한 경로로 설정해야 삭제됨
    cookie.setHttpOnly(true);
    response.addCookie(cookie);
    return ResponseEntity.ok("로그아웃 완료");
  }
}
