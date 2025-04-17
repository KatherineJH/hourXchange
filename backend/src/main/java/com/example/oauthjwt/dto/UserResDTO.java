package com.example.oauthjwt.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.oauthjwt.entity.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResDTO {
  private Long id;

  private String name;

  private String role;

  private String username;

  private String password;

  private String email;

  private LocalDate birthdate;

  private LocalDateTime createdAt;

  private int credit;

  private String status;

  private AddressResDTO address;

  public static UserResDTO toDto(User user) {
    return UserResDTO.builder()
        .id(user.getId())
        .name(user.getName() == null ? "" : user.getName())
        .role(user.getRole().toString())
        .username(user.getUsername())
        .password(user.getPassword() == null ? "" : user.getPassword())
        .email(user.getEmail())
        .birthdate(user.getBirthdate() == null ? LocalDate.of(1, 1, 1) : user.getBirthdate())
        .createdAt(user.getCreatedAt())
        .credit(user.getCredit())
        .status(user.getStatus().toString())
        .address(
            AddressResDTO.toDto(user.getAddress()) == null
                ? null
                : AddressResDTO.toDto(user.getAddress()))
        .build();
  }
}
