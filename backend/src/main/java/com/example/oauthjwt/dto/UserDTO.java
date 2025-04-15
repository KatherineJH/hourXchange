package com.example.oauthjwt.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class UserDTO {

    private String role;
    private String name;
    private String username;
    private String password;
    private String email;
    private LocalDateTime createdAt;
    private int credit;
}
