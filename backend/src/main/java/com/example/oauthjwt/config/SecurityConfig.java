package com.example.oauthjwt.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

import com.example.oauthjwt.jwt.JWTFilter;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.oauth2.CustomSuccessHandler;
import com.example.oauthjwt.service.CustomOAuth2UserService;
import com.example.oauthjwt.service.CustomUserDetailsService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Configuration
@EnableWebSecurity
@Log4j2
public class SecurityConfig {

    @Value("${url.frontend}")
    private String[] allowedOrigins;

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final CustomUserDetailsService customUserDetailsService;
    private final JWTUtil jwtUtil;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, CustomSuccessHandler customSuccessHandler,
                          CustomUserDetailsService customUserDetailsService, JWTUtil jwtUtil) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.customSuccessHandler = customSuccessHandler;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // CORS 설정
        http.cors(corsCustomizer -> corsCustomizer.configurationSource(corsConfigurationSource()));

        // CSRF, 기본 로그인 방식 비활성화
        http.csrf(csrf -> csrf.disable()).formLogin(form -> form.disable()).httpBasic(basic -> basic.disable());

        // OAuth2 설정
        http.oauth2Login(oauth2 -> oauth2.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                .successHandler(customSuccessHandler));

        // JWTFilter 추가
        http.addFilterAfter(new JWTFilter(jwtUtil, customUserDetailsService), OAuth2LoginAuthenticationFilter.class);

        // 인가 설정
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/api/auth/**", "/api/chatrooms", "/login/oauth2/code/**", "/error", "/actuator/health", "/actuator/info") // /error
                .permitAll()
                .anyRequest()
                .authenticated());

        // 세션 비활성화
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
        config.setAllowedOrigins(Arrays.asList(allowedOrigins));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(Arrays.asList("Authorization", "Set-Cookie"));
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ "/ws/**" 처리에 대한 추천 방식
    // WebSocket 경로는 JwtHandshakeInterceptor에서 JWT 검증을 수행
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/ws/**");
    }
}
