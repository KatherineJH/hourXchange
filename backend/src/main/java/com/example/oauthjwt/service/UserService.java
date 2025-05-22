package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {

    UserResponse signup(UserRequest userRequest);

    UserResponse login(UserRequest userRequest);

    UserResponse getUserByEmail(String email);


    @Transactional
    void addCredits(Long userId, int hours);

    @Transactional
    void deductCredits(Long userId, int hours);
}
