package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.service.impl.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.UserSearchCondition;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {

    UserResponse signup(UserRequest userRequest);

    UserResponse login(UserRequest userRequest);

    void changePasswordWithoutOld(Long userId, String newPassword, String confirmPassword);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long userId);

    Page<UserResponse> getUserList(Pageable pageable);

    Page<UserResponse> search(Pageable pageable, UserSearchCondition condition);

    Map<String, Object> getFeaturesByUserId(Long userId);

    UserResponse update(Long userId, UserRequest userRequest, CustomUserDetails userDetails);
}
