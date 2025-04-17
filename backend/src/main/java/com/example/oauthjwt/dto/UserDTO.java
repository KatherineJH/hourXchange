package com.example.oauthjwt.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties
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
