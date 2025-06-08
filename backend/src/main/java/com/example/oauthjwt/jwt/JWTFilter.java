package com.example.oauthjwt.jwt;

import java.io.IOException;
import java.util.Arrays;

import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.oauthjwt.service.impl.CustomUserDetailsService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.server.ResponseStatusException;

@Log4j2
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public JWTFilter(JWTUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        log.info(path);
        if(path.startsWith("/api/auth/logout") || path.startsWith("/api/auth/me") || path.startsWith("/api/auth/refresh")){
            return true;
        };

         return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = jwtUtil.getTokenFromCookiesByName(request, "Authorization");
        log.info(token);

        if (token != null) { // 쿠키가 있으면
            try {
                Claims claims = jwtUtil.getClaims(token); // 여기서 토큰 검증도 같이 함

                String email = claims.get("email", String.class);

                UserDetails userDetails = customUserDetailsService.getUserDetailsByEmail(email);

                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("JWT authentication successful for user: {}", email);
            } catch (ResponseStatusException e){
                // DB에 유저 정보가 없으면 인증 컨텍스트만 클리어하고 넘어감 (익명 처리)
                log.warn("User not found during JWT auth, proceeding anonymously: {}", e.getMessage());
                SecurityContextHolder.clearContext();

                // 쿠키 초기화
                Cookie emptyAccessCookie = jwtUtil.createCookie("Authorization", null, 0); // 엑세스 토큰
                Cookie emptyRefreshCookie = jwtUtil.createCookie("Refresh", null, 0); // 리프레쉬 토큰

                response.addCookie(emptyAccessCookie);
                response.addCookie(emptyRefreshCookie);

            } catch (JwtException e) {
                log.info(e.getMessage());
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
