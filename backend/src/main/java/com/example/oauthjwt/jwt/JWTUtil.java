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

    public static final int ACCESS_TOKEN_TIME = 15 * 60 * 1000; // Token (15분)
    public static final int REFRESH_TOKEN_TIME = 7 * 24 * 60 * 60 * 1000;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String getEmail(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("email", String.class);
        } catch (ExpiredJwtException e){ // 토큰 만료
            throw new JwtException("Expired JWT token");
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException e){ // 토큰 형식, 구조, 서명 불일치
            throw new JwtException("Invalid JWT token");
        } catch (IllegalArgumentException  e) { // 토큰이 비어 있거나 잘못 전달된 경우
            throw new JwtException("Invalid token: " + e.getMessage());
        }
    }

    public String createToken(String email, int time) {
        return Jwts.builder()
                .claim("email", email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_TIME)).signWith(secretKey).compact();
    }

    public String getTokenFromCookiesByName(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null)
            return null;

        return Arrays.stream(cookies).filter(cookie -> name.equals(cookie.getName())).map(Cookie::getValue).findFirst()
                .orElse(null);
    }

    public Cookie createCookie(String key, String value, int maxAgeInSeconds) {
        Cookie cookie = new Cookie(key, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 배포 후 -> true(HTTPS 환경에서만 동작)
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeInSeconds);
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }
}
