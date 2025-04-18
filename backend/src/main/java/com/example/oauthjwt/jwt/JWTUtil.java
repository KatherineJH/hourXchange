package com.example.oauthjwt.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JWTUtil {

  private SecretKey secretKey;

  public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
    secretKey =
        new SecretKeySpec(
            secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
  }

  public String getUsername(String token) {
    try {
      return Jwts.parser()
              .verifyWith(secretKey)
              .build()
              .parseSignedClaims(token)
              .getPayload()
              .get("username", String.class);
    } catch (JwtException e) {
      throw new JwtException("Invalid token: " + e.getMessage());
    }
  }

  public String getRole(String token) {
    return Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .get("role", String.class);
  }

  public Boolean isExpired(String token) {
    return Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getExpiration()
        .before(new Date());
  }

  public String createJwt(String username, String role, Long expiredMs) {

    return Jwts.builder()
        .claim("username", username)
        .claim("role", role)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + expiredMs))
        .signWith(secretKey)
        .compact();
  }

  public String getTokenFromCookies(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null) return null;
    return Arrays.stream(cookies)
            .filter(cookie -> "Authorization".equals(cookie.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);
  }

  public String getUsernameFromToken(String token) {
    Claims claims =
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    return claims.getSubject();
  }

  public Map<String, Object> validateToken(String token) {
    Map<String, Object> claims = null;
    try {
      claims = Jwts.parser().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    } catch (MalformedJwtException e) {
      throw new JwtException("MalFormed"); // 형태 이상
    } catch (ExpiredJwtException e) {
      throw new JwtException("Expired"); // 만료
    } catch (InvalidClaimException e) {
      throw new JwtException("Invalid"); // 유효하지 않은
    } catch (JwtException e) {
      throw new JwtException("JWTError"); // JWT에러
    }
    return claims;
  }
}
