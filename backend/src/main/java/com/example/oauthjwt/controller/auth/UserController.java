package com.example.oauthjwt.controller.auth;

import java.util.Map;

import com.example.oauthjwt.service.UserService;
import com.example.oauthjwt.service.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    // 로그인된 사용자 정보 반환
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        // 쿠키에서 JWT 토큰 가져오기
        String token = jwtUtil.getTokenFromCookies(request);

        // 토큰이 없으면 401 Unauthorized 반환
        if (token == null || jwtUtil.isExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증이 만료되었습니다.");
        }

        // 토큰에서 사용자 정보 추출
        String username = jwtUtil.getUsername(token);

        // 사용자 정보 찾기
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        // 사용자 정보 반환 (UserDTO 형태로 반환할 수도 있음)
        UserDTO result = UserDTO.builder()
                .username(user.getUsername())
                .name(user.getName())
                .role(user.getRole().toString())
                .build();

        return ResponseEntity.ok(result);
    }


    // ✅ 일반 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) {
        Map<String, String> userExistsCheckResult = userService.userExistsCheck(userDTO);
        if(userExistsCheckResult.isEmpty()) { // 처리결과에 에러가 존재하는 경우
            ResponseEntity.ok(userExistsCheckResult); // 상태값은 의견 교환 후 변경 가능 200, 400 등
        }
        UserDTO result = userService.signup(userDTO);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpServletResponse response) {
        User user = userRepository.findByUsername(userDTO.getUsername());

        if (user == null || !passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        String token =
                jwtUtil.createJwt(user.getUsername(), user.getRole().toString(), 60 * 60 * 1000L);

        // token을 쿠키에 저장
        Cookie cookie = new Cookie("Authorization", token);
        cookie.setPath("/");
        cookie.setMaxAge(3600);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok()
                .body(
                        Map.of(
                                "message", "로그인 성공",
                                "username", user.getUsername(),
                                "name", user.getName(),
                                "role", user.getRole()));
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
