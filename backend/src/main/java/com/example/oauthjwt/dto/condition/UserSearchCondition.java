package com.example.oauthjwt.dto.condition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSearchCondition {
    private Long userId;
    private String email;
    private String name;
    private String username;
    private String role;
    private String status;
}
