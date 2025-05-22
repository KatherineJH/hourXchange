package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {

    UserResponse signup(UserRequest userRequest);

    UserResponse login(UserDTO userDto);

    UserResponse getUserByEmail(String email);


    @Transactional
    void addCredits(Long userId, int hours);

    @Transactional
    void deductCredits(Long userId, int hours);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long userId);
}
