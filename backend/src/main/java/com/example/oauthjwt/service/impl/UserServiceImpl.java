package com.example.oauthjwt.service.impl;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.entity.Address;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse signup(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일이 중복되었습니다.");
        }
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임이 중복되었습니다.");
        }

        Address address = Address.of(userRequest.getAddress());

        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        User result = userRepository.save(User.of(userRequest, address));

        return UserResponse.toDto(result);
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

    @Override
    public Map<String, String> isEquals(Long tokenId, Long requestId) {
        if (!tokenId.equals(requestId)) {
            return Map.of("error", "요청한 사용자의 아이디가 일치하지 않습니다.");
        }
        return Collections.emptyMap();
    }
}
