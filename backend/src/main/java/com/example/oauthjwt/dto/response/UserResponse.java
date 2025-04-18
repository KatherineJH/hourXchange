package com.example.oauthjwt.dto.response;

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
public class UserResponse {
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

  private AddressResponse address;

  public static UserResponse toDto(User user) {
    return UserResponse.builder()
        .id(user.getId())
        .name(user.getName() == null ? "" : user.getName())
        .role(user.getRole().toString())
        .username(user.getUsername())
        // 패스워드 노출 이슈 -> 향후에 제거해도 좋을 것 같습니다.
        .password(user.getPassword() == null ? "" : user.getPassword())
        .email(user.getEmail())
        .birthdate(user.getBirthdate() == null ? LocalDate.of(1, 1, 1) : user.getBirthdate())
        .createdAt(user.getCreatedAt())
        .credit(user.getCredit())
        .status(user.getStatus().toString())
        .address(
            AddressResponse.toDto(user.getAddress()) == null
                ? null
                : AddressResponse.toDto(user.getAddress()))
        .build();
  }
}
