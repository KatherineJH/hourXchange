package com.example.oauthjwt.dto;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String role;
    private String name;
    private String username;
    private String password;
    private String email;
}
