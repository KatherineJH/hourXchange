package com.example.oauthjwt.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.service.CustomUserDetails;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
  // 로그인된 사용자 정보 반환
  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    // auth.getPrincipal()이 CustomUserDetails가 아닌 경우 ClassCastException이 발생
    if (!(auth.getPrincipal() instanceof CustomUserDetails userDetails)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
              .body(Map.of("error", "Invalid user details"));
    }
    return ResponseEntity.ok(
            UserDTO.builder()
                    .id(userDetails.getUser().getId())
                    .email(userDetails.getUser().getEmail())
                    .username(userDetails.getUser().getUsername())
                    .name(userDetails.getUser().getName())
                    .role(userDetails.getUser().getRole().name())
                    .createdAt(userDetails.getUser().getCreatedAt())
                    .credit(userDetails.getUser().getCredit())
                    .build());
  }
}
