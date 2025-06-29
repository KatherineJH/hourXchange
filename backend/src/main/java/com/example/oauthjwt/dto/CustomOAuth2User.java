package com.example.oauthjwt.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.example.oauthjwt.dto.response.UserResponse;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {

    private final UserResponse userResponse;

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(() -> userResponse.getRole()); // 사용자 역할을 권한으로 설정
        return collection;
    }

    @Override
    public String getName() {
        return userResponse.getName();
    }

    public String getEmail() {
        return userResponse.getEmail();
    }

    public String getUsername() {
        return userResponse.getUsername();
    }
}
