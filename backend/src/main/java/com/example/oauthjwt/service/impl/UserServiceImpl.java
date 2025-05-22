package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.entity.Wallet;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));

        return UserResponse.toDto(user);
    }

    @Override
    @Transactional
    public void addCredits(Long userId, int hours) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        user.addCredit(hours); // 내부적으로 wallet.addCredit 호출
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deductCredits(Long userId, int hours) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        user.subtractCredit(hours); // 내부적으로 wallet.subtractCredit 호출
        userRepository.save(user);
    }

}
