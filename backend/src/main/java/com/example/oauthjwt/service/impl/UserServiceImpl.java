package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.repository.AddressRepository;
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
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse signup(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일이 중복되었습니다.");
        }
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임이 중복되었습니다.");
        }

        User user = User.of(userRequest);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        AddressRequest addressRequest = userRequest.getAddress();
        if(addressRequest.isEmpty()){
            Address address = addressRepository.save(Address.of(userRequest.getAddress()));
            user.setAddress(address);
        }


        User result = userRepository.save(user);

        return UserResponse.toDto(result);
    }

    @Override
    public UserResponse login(UserDTO userDTO) {
        User user = userRepository.findByEmail(userDTO.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유저 정보가 존재하지 않습니다."));
        if(!user.getEmail().equals(userDTO.getEmail()) || !passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디 또는 비밀번호가 일치하지 않습니다.");
        }
        return UserResponse.toDto(user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유저 정보가 존재하지 않습니다."));

        return UserResponse.toDto(user);
    }

    @Override
    @Transactional
    public void addCredits(Long userId, int hours) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        user.setCredit(user.getCredit() + hours);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deductCredits(Long userId, int hours) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        if (user.getCredit() < hours) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "크레딧이 부족합니다.");
        }
        user.setCredit(user.getCredit() - hours);
        userRepository.save(user);
    }
}
