package com.example.oauthjwt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@JsonIgnoreProperties
public class UserDTO {

    private Long id;
    private String role;
    private String name;
    private String username;
    private String password;
    private String email;
    private LocalDateTime createdAt;
    private int credit;
}
