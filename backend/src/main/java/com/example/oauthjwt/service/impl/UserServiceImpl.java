package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.config.SecurityConfig;
import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.UserRole;
import com.example.oauthjwt.entity.UserStatus;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final SecurityConfig securityConfig;

    @Override
    public UserDTO signup(UserDTO userDTO){
        User user = User.builder()
                .email(userDTO.getEmail())
                .username(userDTO.getUsername())
                .name(userDTO.getName())
                .password(securityConfig.passwordEncoder().encode(userDTO.getPassword()))
                .createdAt(LocalDateTime.now())
                .credit(0)
                .status(UserStatus.ACTIVE)
                .role(UserRole.ROLE_USER)
                .build();

        User result = userRepository.save(user);

        return UserDTO.builder()
                .email(result.getEmail())
                .username(result.getUsername())
                .name(result.getName())
                .password(result.getPassword())
                .createdAt(result.getCreatedAt())
                .credit(result.getCredit())
                .role(result.getRole().toString())
                .build();
    }

    @Override
    public Map<String, String> notExistsByEmail(String email) {
        if (userRepository.existsByEmail(email)) { // 이메일로 조회한 정보가 존재하는 경우
            return Map.of("error", "해당 이메일은 이미 사용중입니다.");
        }
        return Collections.emptyMap();
    }

    @Override
    public Map<String, String> existsById(Long id) {
        if (!userRepository.existsById(id)) { // id로 조회한 정보가 존재하지 않는 경우
            return Map.of("error", "사용자를 찾을 수 없습니다.");
        }
        return Collections.emptyMap();
    }
}
