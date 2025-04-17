package com.example.oauthjwt.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String name;
    private String role;
    private String username;
    private String password;
    private String email;
    private LocalDateTime createdAt;
    private int credit;
}
