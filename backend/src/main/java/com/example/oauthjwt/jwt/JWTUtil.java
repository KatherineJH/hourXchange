package com.example.oauthjwt.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import io.jsonwebtoken.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
@Log4j2
public class JWTUtil {

    private SecretKey secretKey;

    public static final int ACCESS_TOKEN_TIME = 60 * 60 * 1000; // Token (1시간)
    public static final int REFRESH_TOKEN_TIME = 7 * 24 * 60 * 60 * 1000;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e){ // 토큰 만료
            throw new JwtException("Expired JWT token");
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException e){ // 토큰 형식, 구조, 서명 불일치
            throw new JwtException("Invalid JWT token");
        } catch (IllegalArgumentException  e) { // 토큰이 비어 있거나 잘못 전달된 경우
            throw new JwtException("Invalid token: " + e.getMessage());
        }
    }

    public String createToken(Map<String, Object> claims, int time) {
        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + time))
                .signWith(secretKey)
                .compact();
    }

    public String getTokenFromCookiesByName(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null)
            return null;

        return Arrays.stream(cookies).filter(cookie -> name.equals(cookie.getName())).map(Cookie::getValue).findFirst()
                .orElse(null);
    }

    public Cookie createCookie(String key, String value, int maxAgeInSeconds) {
        log.info(key + " : " + value + " : " + maxAgeInSeconds);
        Cookie cookie = new Cookie(key, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 배포 후 -> true(HTTPS 환경에서만 동작)
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeInSeconds);
        cookie.setAttribute("SameSite", "Lax");
        return cookie;
    }
}
