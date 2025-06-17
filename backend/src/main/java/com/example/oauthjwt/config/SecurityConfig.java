package com.example.oauthjwt.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.oauthjwt.handler.CustomAuthenticationSuccessHandler;
import com.example.oauthjwt.jwt.JWTFilter;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.service.impl.CustomOAuth2UserService;
import com.example.oauthjwt.service.impl.CustomUserDetailsService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Configuration
@EnableWebSecurity
@Log4j2
@EnableMethodSecurity // PreAuthorize 어노테이션 활성화 배포 후 주석 해제
public class SecurityConfig {

    @Value("${url.frontend}")
    private String[] allowedOrigins;

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
            CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler, JWTUtil jwtUtil,
            CustomUserDetailsService customUserDetailsService) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.customAuthenticationSuccessHandler = customAuthenticationSuccessHandler;
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CORS 설정
        http.cors(customizer -> customizer.configurationSource(corsConfigurationSource()));

        // CSRF, 폼 로그인, HTTP Basic 비활성화
        http.csrf(csrf -> csrf.disable()).formLogin(form -> form.disable()).httpBasic(basic -> basic.disable());

        // OAuth2 로그인 설정
        http.oauth2Login(oauth2 -> oauth2.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                .successHandler(customAuthenticationSuccessHandler));

        // JWT 필터 추가
        http.addFilterAfter(new JWTFilter(jwtUtil, customUserDetailsService), OAuth2LoginAuthenticationFilter.class);

        // 인가 설정
        http.authorizeHttpRequests(auth -> auth
                // Preflight OPTIONS 요청 허용
                .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                // Actuator 공개 엔드포인트
                .requestMatchers("/actuator/health/**", "/actuator/info/**").permitAll()
                // 인증 없이 허용할 API
                .requestMatchers("/api/auth/signup", "/api/auth/login", "/api/auth/logout", "/api/auth/refresh", "/api/auth/me").permitAll()
                .requestMatchers("/", "/api/advertisement/**", "/login/oauth2/code/**", "/error").permitAll()
                .requestMatchers(
                        "/api/category/list", "/api/donation/recent", "/api/donation/top-progress", "/api/donation/top-views",
                        "/api/donation/list/all", "/api/product/list/all", "/api/donationHistory/topDonator", "/api/donation/list", "/api/auth/dev/password",
                        "/api/board/all", "/api/product/listMap", "/api/product/list", "/api/reviews/list", "/api/search/**", "/api/dialogflow/query"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/product/**", "/api/donation/**").permitAll()
                // 그 외 요청은 인증 필요
                .anyRequest().authenticated());

        // 세션 상태를 Stateless로 설정
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 예외 처리
        http.exceptionHandling(exceptions -> exceptions.authenticationEntryPoint((request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\"}");
        }).accessDeniedHandler((request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Forbidden\"}");
        }));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Protocol://host:port 형태 맞춰 등록된 allowedOrigins 사용
        config.setAllowedOriginPatterns(Arrays.asList(allowedOrigins));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(Arrays.asList("Authorization", "Set-Cookie"));
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // /api/** 경로에만 CORS 정책 적용
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        // WebSocket 경로는 보안 필터 무시
        return web -> web.ignoring().requestMatchers("/ws/**");
    }
}
