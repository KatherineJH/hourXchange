package com.example.oauthjwt.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
  private Long id;
  @NotBlank
  private String email;
  @NotBlank
  private String password;
  @NotBlank
  private String name;
  @NotBlank
  private String username;
  private LocalDate birthdate;

  private AddressRequest address;
}
