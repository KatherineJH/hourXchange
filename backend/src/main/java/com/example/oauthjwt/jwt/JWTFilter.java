package com.example.oauthjwt.jwt;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.oauthjwt.service.CustomUserDetailsService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
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

    // 🔐 예외 처리: 로그인 및 OAuth2 경로는 JWT 인증 안 함
    String requestUri = request.getRequestURI();
    if (requestUri.matches("^/login(?:/.*)?$") || requestUri.matches("^/oauth2(?:/.*)?$")) {
      return true;
    }
    // return false;
    // 프론트 테스트 시 없으면 에러 발생해서 추가했는데, 다른 방식이 있다면 바꿔주셔도 됩니다.
    return path.startsWith("/api/auth/") || path.startsWith("/oauth2/") || path.startsWith("/login")
        || path.startsWith("/login/oauth2/code/");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // 2. 쿠키 사용 함 - 프론트 채팅 테스트 시 주석 풀고 사용
    String token = null;
    Cookie[] cookies = request.getCookies();
    if (cookies != null) { // 쿠키가 있으면
      try {
        token = Arrays.stream(cookies).filter(cookie -> "Authorization".equals(cookie.getName())).map(Cookie::getValue)
            .findFirst().orElse(null);

        if (token != null) {
          if (jwtUtil.isExpired(token)) {
            throw new JwtException("토큰이 만료되었습니다.");
          }

          Map<String, Object> claims = jwtUtil.validateToken(token);
          String username = claims.get("username").toString();
          UserDetails userDetails = userDetailsService.loadUserByUsername(username);

          Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails, null,
              userDetails.getAuthorities());
          SecurityContextHolder.getContext().setAuthentication(authToken);
          log.debug("JWT authentication successful for user: {}", username);
        }
      } catch (JwtException e) {
        SecurityContextHolder.clearContext();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"" + e.getMessage() + "\"}");
        return;
      }
    } // end if

    filterChain.doFilter(request, response);
  }
}
