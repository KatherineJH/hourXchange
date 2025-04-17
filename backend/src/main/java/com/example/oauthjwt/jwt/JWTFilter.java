package com.example.oauthjwt.jwt;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.oauthjwt.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Slf4j
public class JWTFilter extends OncePerRequestFilter {

  private final JWTUtil jwtUtil;
  private final CustomUserDetailsService userDetailsService;

  public JWTFilter(JWTUtil jwtUtil, CustomUserDetailsService userDetailsService) {
    this.jwtUtil = jwtUtil;
    this.userDetailsService = userDetailsService;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String path = request.getRequestURI();
    //    if(path.startsWith("/api/user/me")){
    //      return false;
    //    }
    //    if(path.startsWith("/api/")){ // 개발 중 토큰 검사 x
    //      return true;
    //    }

    // 🔐 예외 처리: 로그인 및 OAuth2 경로는 JWT 인증 안 함
    String requestUri = request.getRequestURI();
    if (requestUri.matches("^/login(?:/.*)?$") || requestUri.matches("^/oauth2(?:/.*)?$")) {
      return true;
    }
    return false;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    // 1. 쿠키 사용하지 않는 방식
    String authHeaderStr = request.getHeader("Authorization"); // 헤더에 Authorization 이름으로 "Bearer " + token으로 보냄
    String authorization = authHeaderStr.substring(7); // "Bearer "를 제외한 토큰 값만
    Map<String, Object> claims = jwtUtil.validateToken(authorization); // 토큰에서 값 추출과 검증

    /**
     * ✅ 유효한 토큰 → 사용자 정보 추출
     * String username = jwtUtil.getUsername(authorization);
     * loadUserByUsername이 유저 정보를 조회할 수 있게 함
     * */
    UserDetails userDetails =
        userDetailsService.loadUserByUsername(
            claims.get("username").toString()); // 토큰에 있던 email 값으로 조회
    Authentication authToken =
        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(authToken);
    filterChain.doFilter(request, response);
  }
}
