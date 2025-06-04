package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.condition.UserSearchCondition;
import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.entity.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse signup(UserRequest userRequest) {
        // 유니크 항목 검사
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일이 중복되었습니다.");
        }
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임이 중복되었습니다.");
        }

        // 객체 생성
        User user = User.of(userRequest);

        // 비밀번호, 지갑, 주소 설정
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        Wallet wallet = Wallet.of(user);
        user.setWallet(wallet);

        AddressRequest addressRequest = userRequest.getAddress();
        if(!addressRequest.isEmpty()){
            Address address = Address.of(userRequest.getAddress());
            user.setAddress(address);
        }
        // 저장 및 반환
        User result = userRepository.save(user);
        return UserResponse.toDto(result);
    }

    @Override
    public UserResponse login(UserRequest userRequest) {
        // 유저 조회
        User user = userRepository.findByEmail(userRequest.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
        // 입력값 확인
        if(!user.getEmail().equals(userRequest.getEmail()) || !passwordEncoder.matches(userRequest.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디 또는 비밀번호가 일치하지 않습니다.");
        }
        // 반환
        return UserResponse.toDto(user);
    }

    @Override
    public void changePasswordWithoutOld(Long userId, String newPassword, String confirmPassword) {
        if (newPassword == null || confirmPassword == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호는 필수입니다.");
        }
        if (!newPassword.equals(confirmPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다.");
        }
        if (newPassword.length() < 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호는 최소 5자 이상이어야 합니다.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        return UserResponse.toDto(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.toDto(user);
    }

    @Override
    public Page<UserResponse> getUserList(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserResponse::toDto);
    }

    @Override
    public Page<UserResponse> search(Pageable pageable, UserSearchCondition condition) {

        Page<User> userPage = userRepository.search(condition, pageable);
        return userPage.map(UserResponse::toDto);
    }

    @Override
    public Map<String, Object> getFeaturesByUserId(Long userId) {
        List<Object[]> result = userRepository.getUserFeatureRawByUserId(userId);

        if (result == null || result.isEmpty()) {
            throw new IllegalStateException("유저 특성 정보가 부족합니다 (결과 없음)");
        }

        Object[] row = result.get(0);
        log.info("🎯 User features raw: {}", Arrays.toString(row));

        if (row.length != 9 || Arrays.stream(row).anyMatch(Objects::isNull)) {
            throw new IllegalStateException("유저 특성 정보가 부족합니다 (null 포함)");
        }

        Map<String, Object> features = new HashMap<>();
        features.put("age", ((Number) row[0]).intValue());
        features.put("daysSinceSignup", ((Number) row[1]).intValue());
        features.put("visitCount", ((Number) row[2]).intValue());
        features.put("distinctUrlCount", ((Number) row[3]).intValue());
        features.put("paymentCount", ((Number) row[4]).intValue());
        features.put("totalPaymentAmount", ((Number) row[5]).doubleValue());
        features.put("transactionCount", ((Number) row[6]).intValue());
        features.put("reviewCount", ((Number) row[7]).intValue());
        features.put("avgStarsGiven", ((Number) row[8]).doubleValue());

        return features;
    }

}
