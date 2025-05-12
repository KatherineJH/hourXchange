package com.example.oauthjwt.jwt;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

import com.example.oauthjwt.service.UserService;
import lombok.RequiredArgsConstructor;
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
    private final CustomUserDetailsService customUserDetailsService;

    public JWTFilter(JWTUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

//        // 프론트 테스트 시 없으면 에러 발생해서 추가했는데, 다른 방식이 있다면 바꿔주셔도 됩니다.
        String path = request.getRequestURI();
        if(path.startsWith("/api/auth/") || path.startsWith("/oauth2/") || path.startsWith("/api/auth/login") || path.startsWith("/login/oauth2/code/")){
            return true;
        };

         return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 2. 쿠키 사용 함 - 프론트 채팅 테스트 시 주석 풀고 사용
        Cookie[] cookies = request.getCookies();
        String token = null;
        if(cookies != null) {
            token = Arrays.stream(cookies).filter(cookie -> "Authorization".equals(cookie.getName()))
                    .map(Cookie::getValue).findFirst().orElse(null);
        }

        if (token != null) { // 쿠키가 있으면
            try {
                String email = jwtUtil.getEmail(token); // 여기서 토큰 검증도 같이 함

                UserDetails userDetails = customUserDetailsService.getUserDetailsByEmail(email);

                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("JWT authentication successful for user: {}", email);
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
