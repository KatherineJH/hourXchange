package com.example.oauthjwt.controller.auth;

import java.util.Map;

import com.example.oauthjwt.entity.USER_TYPE;
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
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    // 로그인된 사용자 정보 반환
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        // 쿠키에서 JWT 토큰 가져오기
        String token = getTokenFromCookies(request);

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
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());

        return ResponseEntity.ok(userDTO);
    }

    private String getTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("Authorization".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    // ✅ 일반 회원가입 처리
    @PostMapping("/signup")
    public String signup(@RequestBody UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()) != null) {
            return "이미 존재하는 사용자입니다.";
        }
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setRole(USER_TYPE.USER);
        user.setEmail("");

        // 암호화된 비밀번호 저장
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return "회원가입 성공!";
    }

    //    @PostMapping("/login")
    //    public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpServletResponse response)
    // {
    //        User user = userRepository.findByUsername(userDTO.getUsername());
    //
    //        if (user == null || !passwordEncoder.matches(userDTO.getPassword(),
    // user.getPassword())) {
    //            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지
    // 않습니다.");
    //        }
    //
    //        // JWT 생성
    //        String token = jwtUtil.createJwt(user.getUsername(), user.getRole(), 60 * 60 * 1000L);
    // // 1시간
    //
    //        // 쿠키로도 저장 (선택 사항)
    //        Cookie cookie = new Cookie("Authorization", token);
    //        cookie.setHttpOnly(true);
    //        cookie.setPath("/");
    //        cookie.setMaxAge(60 * 60);
    //        response.addCookie(cookie);
    //
    //        // ✅ 토큰을 바디에도 포함시켜서 프론트가 직접 활용 가능하도록
    //        return ResponseEntity.ok().body(Map.of(
    //                "message", "로그인 성공",
    //                "token", token,
    //                "username", user.getUsername(),
    //                "name", user.getName(),
    //                "role", user.getRole()
    //        ));
    //    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO, HttpServletResponse response) {
        User user = userRepository.findByUsername(userDTO.getUsername());

        if (user == null || !passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        String token = jwtUtil.createJwt(user.getUsername(), user.getRole().toString(), 60 * 60 * 1000L);

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
