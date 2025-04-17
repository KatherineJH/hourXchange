package com.example.oauthjwt.config;

import java.util.Collections;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.oauthjwt.jwt.JWTFilter;
import com.example.oauthjwt.jwt.JWTUtil;
import com.example.oauthjwt.oauth2.CustomSuccessHandler;
import com.example.oauthjwt.service.CustomOAuth2UserService;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final JWTUtil jwtUtil;

    public SecurityConfig(
            CustomOAuth2UserService customOAuth2UserService,
            CustomSuccessHandler customSuccessHandler,
            JWTUtil jwtUtil) {

        this.customOAuth2UserService = customOAuth2UserService;
        this.customSuccessHandler = customSuccessHandler;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // CORS 설정
        http.cors(
                corsCustomizer ->
                        corsCustomizer.configurationSource(
                                new CorsConfigurationSource() {
                                    @Override
                                    public CorsConfiguration getCorsConfiguration(
                                            HttpServletRequest request) {
                                        CorsConfiguration config = new CorsConfiguration();
                                        config.setAllowedOrigins(
                                                Collections.singletonList("http://localhost:5173"));
                                        config.setAllowedMethods(
                                                Collections.singletonList("*")); // 모든 HTTP 메소드 허용
                                        config.setAllowCredentials(true); // 자격 증명 허용
                                        config.setAllowedHeaders(Collections.singletonList("*"));
                                        config.setExposedHeaders(
                                                List.of(
                                                        "Set-Cookie",
                                                        "Authorization")); // 클라이언트에 노출할 헤더 설정
                                        config.setMaxAge(3600L); // 캐시 최대 시간 설정 (1시간)
                                        return config;
                                    }
                                }));

        // CSRF, 기본 로그인 방식 비활성화 (JWT 사용을 위한 설정)
        http.csrf(csrf -> csrf.disable());
        http.formLogin(form -> form.disable());
        http.httpBasic(basic -> basic.disable());

        // OAuth2 설정
        http.oauth2Login(
                oauth2 ->
                        oauth2.userInfoEndpoint(
                                        userInfo ->
                                                userInfo.userService(
                                                        customOAuth2UserService) // OAuth2 사용자 서비스
                                        // 설정
                                        )
                                .successHandler(customSuccessHandler) // 로그인 성공 후 처리 로직 설정
                );

        // ✅ JWTFilter를 OAuth2 인증 필터 뒤에 추가 (중요)
        http.addFilterAfter(new JWTFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class);

        // 인가 설정
        http.authorizeHttpRequests(
                auth ->
                        auth.requestMatchers("/", "/api/auth/**", "/api/**") // 개발 중 모든 입력 허락
                                .permitAll()
                                .requestMatchers("/my")
                                .hasRole("USER")
                                .anyRequest()
                                .authenticated());

        // 세션 비활성화 (JWT 기반 인증을 사용하기 위해 세션을 사용하지 않음)
        http.sessionManagement(
                session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
