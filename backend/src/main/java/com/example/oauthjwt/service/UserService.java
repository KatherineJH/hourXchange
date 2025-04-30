package com.example.oauthjwt.service;

import java.util.Map;

import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;

public interface UserService {

  UserResponse signup(UserRequest userRequest);

  Map<String, String> notExistsByEmail(String email);

  Map<String, String> existsById(Long id);

  Map<String, String> isEquals(Long tokenId, Long requestId);
}
