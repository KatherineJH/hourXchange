package com.example.oauthjwt.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.UserDTO;


public interface UserService {

  UserDTO signup(UserDTO userDTO);

  Map<String, String> notExistsByEmail(String email);

  Map<String, String> existsById(Long id);

  Map<String, String> isEquals(Long tokenId, Long requestId);
}
