package com.example.oauthjwt.service;

import java.util.List;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {

    UserResponse signup(UserRequest userRequest);

    UserResponse login(UserRequest userRequest);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long userId);

    Page<UserResponse> getUserList(Pageable pageable);
}
