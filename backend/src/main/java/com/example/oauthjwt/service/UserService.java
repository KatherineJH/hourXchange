package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.UserDTO;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface UserService {

    UserDTO signup(UserDTO userDTO);
    Map<String, String> userExistsCheck(UserDTO userDTO);
}
