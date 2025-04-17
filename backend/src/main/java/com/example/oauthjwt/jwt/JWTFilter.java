package com.example.oauthjwt.jwt;

import java.io.IOException;
import java.util.stream.Stream;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.oauthjwt.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
//    return false;
    return path.startsWith("/api/auth/login")   // 로그인
            || path.startsWith("/api/auth/signup")  // 회원가입
            || path.startsWith("/oauth2")           // OAuth2
            || path.startsWith("/login");           // 기본 로그인
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // 🔐 예외 처리: 로그인 및 OAuth2 경로는 JWT 인증 안 함
    String requestUri = request.getRequestURI();
    if (requestUri.matches("^/login(?:/.*)?$") || requestUri.matches("^/oauth2(?:/.*)?$")) {
      filterChain.doFilter(request, response);
      return;
    }
    // 🍪 Authorization 쿠키에서 토큰 가져오기
    String authorization = null;

    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (cookie.getName().equals("Authorization")) {
          authorization = cookie.getValue();
        }
      }
    }

    // Authorization 헤더 검증
    // 🚫 토큰이 없으면 다음 필터로
    if (authorization == null) {
      System.out.println("token null");
      filterChain.doFilter(request, response);
      return;
    }

    // ⏳ 만료된 토큰이면 필터 통과만
    if (jwtUtil.isExpired(authorization)) {
      System.out.println("token expired");
      filterChain.doFilter(request, response);
      return;
    }

    // ✅ 유효한 토큰 → 사용자 정보 추출
    String username = jwtUtil.getUsername(authorization);
    // loadUserByUsername이 유저 정보를 조회할 수 있게 함
    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    Authentication authToken =
        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

    SecurityContextHolder.getContext().setAuthentication(authToken);
    filterChain.doFilter(request, response);
    System.out.println("🎉 인증 성공: " + username);
    System.out.println("🔍 SecurityContext 인증 여부: " + SecurityContextHolder.getContext().getAuthentication().isAuthenticated());
  }
}
