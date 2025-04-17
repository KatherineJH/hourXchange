package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.service.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    // 로그인된 사용자 정보 반환
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 토큰이 없으면 401 Unauthorized 반환
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        return ResponseEntity.ok(
                UserDTO.builder()
                        .id(userDetails.getUser().getId())
                        .email(userDetails.getUser().getEmail())
                        .username(userDetails.getUser().getUsername())
                        .name(userDetails.getUser().getName())
                        .role(userDetails.getUser().getRole().name())
                        .createdAt(userDetails.getUser().getCreatedAt())
                        .credit(userDetails.getUser().getCredit())
                        .build()
        );
    }
}
