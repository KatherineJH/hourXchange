package com.example.oauthjwt.dto.request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {

    private String email;

    private String password;

    private String name;

    private String username;

    private LocalDate birthdate;

    private AddressRequest address;
}
