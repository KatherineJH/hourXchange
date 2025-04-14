package com.example.oauthjwt.dto;

import com.example.oauthjwt.entity.USER_TYPE;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

//    private String role;
    private USER_TYPE role;
    private String name;
    private String username;
    private String password;
    // test test
    // test2 test2
}
