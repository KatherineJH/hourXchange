package com.example.oauthjwt.oauth2;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.oauthjwt.dto.CustomOAuth2User;
import com.example.oauthjwt.jwt.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import static com.example.oauthjwt.jwt.JWTUtil.ACCESS_TOKEN_TIME;
import static com.example.oauthjwt.jwt.JWTUtil.REFRESH_TOKEN_TIME;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Value("${url.frontend}")
    String urlFrontend;

    private final JWTUtil jwtUtil;

    public CustomSuccessHandler(JWTUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        // ✅ email 기반으로 JWT 생성
        String email = customUserDetails.getEmail();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // JWT 토큰 생성
        String accessToken = jwtUtil.createToken(Map.of("email", email), ACCESS_TOKEN_TIME); // 15분
        String refreshToken = jwtUtil.createToken(Map.of("email", email), REFRESH_TOKEN_TIME); // 7일

        // JWT 토큰을 쿠키로 전달
        response.addCookie(jwtUtil.createCookie("Authorization", accessToken, ACCESS_TOKEN_TIME));
        response.addCookie(jwtUtil.createCookie("Refresh", refreshToken, REFRESH_TOKEN_TIME));
        response.sendRedirect(urlFrontend);

    }
}
