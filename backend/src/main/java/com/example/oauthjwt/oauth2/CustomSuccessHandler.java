package com.example.oauthjwt.oauth2;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

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

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final JWTUtil jwtUtil;

  public CustomSuccessHandler(JWTUtil jwtUtil) {

    this.jwtUtil = jwtUtil;
  }

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException, ServletException {

    // OAuth2User
    CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
    // ✅ email 기반으로 JWT 생성
    String username = customUserDetails.getEmail();

    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
    GrantedAuthority auth = iterator.next();
    String role = auth.getAuthority();

    // JWT 토큰 생성: 60일
    String token = jwtUtil.createJwt(username, role, 60 * 60 * 60 * 60L);

    // JWT 토큰을 쿠키로 전달
    response.addCookie(createCookie("Authorization", token));
    response.sendRedirect("http://localhost:5173/");
  }

  private Cookie createCookie(String key, String value) {

    Cookie cookie = new Cookie(key, value);
    cookie.setMaxAge(60 * 60 * 60 * 60); // 만료 시간 설정 (60일)
    // cookie.setSecure(true);
    cookie.setPath("/");
    cookie.setHttpOnly(true); // 클라이언트 자바스크립트 접근 방지

    return cookie;
  }
}
