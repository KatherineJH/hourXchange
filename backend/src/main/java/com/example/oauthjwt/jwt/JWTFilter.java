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

    //🔐 예외 처리: 로그인 및 OAuth2 경로는 JWT 인증 안 함
    String requestUri = request.getRequestURI();
    if (requestUri.matches("^/login(?:/.*)?$") || requestUri.matches("^/oauth2(?:/.*)?$")) {
      return true;
    }
//    return false;
    // 프론트 테스트 시 없으면 에러 발생해서 추가했는데, 다른 방식이 있다면 바꿔주셔도 됩니다.
    return path.startsWith("/api/auth/") ||
            path.startsWith("/oauth2/") ||
            path.startsWith("/login") ||
            path.startsWith("/login/oauth2/code/");
  }

  /**
   * 🔒 accessToken은 localStorage에 저장하고 요청 헤더에 Authorization: Bearer <token> 형식으로 보냄
   * 🔐 refreshToken만 HttpOnly 쿠키에 저장해서 백엔드 /refresh에서만 사용
   * 따라서 JWTFilter는 더 이상 쿠키를 읽으면 안 되고, 헤더만 검사해야 합니다.
   * */
  @Override
  protected void doFilterInternal(
          HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
          throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      log.debug("No Authorization header found");
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.getWriter().write("{\"error\": \"No token provided\"}");
      return;
    }

    String token = authHeader.substring(7); // "Bearer " 제외

    try {
      if (jwtUtil.isExpired(token)) {
        log.debug("Token expired");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Token expired\"}");
        return;
      }

      Map<String, Object> claims = jwtUtil.validateToken(token);
      String username = claims.get("username").toString();
      UserDetails userDetails = userDetailsService.loadUserByUsername(username);

      Authentication authToken = new UsernamePasswordAuthenticationToken(
              userDetails, null, userDetails.getAuthorities());
      SecurityContextHolder.getContext().setAuthentication(authToken);
      log.debug("JWT authentication successful for user: {}", username);
    } catch (JwtException e) {
      log.error("JWT validation failed: {}", e.getMessage());
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.getWriter().write("{\"error\": \"Invalid token\"}");
      return;
    }

    filterChain.doFilter(request, response);
  }
}