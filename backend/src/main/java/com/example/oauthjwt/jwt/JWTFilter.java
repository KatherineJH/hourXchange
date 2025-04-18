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

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
//    // 1. 쿠키 사용하지 않는 방식
//    String authHeaderStr = request.getHeader("Authorization"); // 헤더에 Authorization 이름으로 "Bearer " + token으로 보냄
//    String authorization = authHeaderStr.substring(7); // "Bearer "를 제외한 토큰 값만
//    Map<String, Object> claims = jwtUtil.validateToken(authorization); // 토큰에서 값 추출과 검증
//
//    /**
//     * ✅ 유효한 토큰 → 사용자 정보 추출
//     * String username = jwtUtil.getUsername(authorization);
//     * loadUserByUsername이 유저 정보를 조회할 수 있게 함
//     * */
//    UserDetails userDetails =
//        userDetailsService.loadUserByUsername(
//            claims.get("username").toString()); // 토큰에 있던 email 값으로 조회
//    Authentication authToken =
//        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//    SecurityContextHolder.getContext().setAuthentication(authToken);
//    filterChain.doFilter(request, response);

    // 2. 쿠키 사용 함 - 프론트 채팅 테스트 시 주석 풀고 사용
    String token = null;
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      token = Arrays.stream(cookies)
              .filter(cookie -> "Authorization".equals(cookie.getName()))
              .map(Cookie::getValue)
              .findFirst()
              .orElse(null);
    }

    if (token == null) {
      log.debug("No Authorization cookie found");
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType("application/json");
      response.getWriter().write("{\"error\": \"No token provided\"}");
      return;
    }

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
