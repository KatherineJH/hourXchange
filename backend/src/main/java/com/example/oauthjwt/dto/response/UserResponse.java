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

    private String email;

//    private String password; 보안상 주석처리

    private String name;

    private String username;

    private LocalDate birthdate;

    private String role;

    private String status;

    private LocalDateTime createdAt;

    private WalletResponse wallet;

    private AddressResponse address;

    public static UserResponse toDto(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .username(user.getUsername())
                .birthdate(user.getBirthdate())
                .role(user.getRole().toString())
                .status(user.getStatus().toString())
                .createdAt(user.getCreatedAt())
                .wallet(WalletResponse.toDto(user.getWallet()))
                .address(AddressResponse.toDto(user.getAddress()))
                .build();
    }
}
