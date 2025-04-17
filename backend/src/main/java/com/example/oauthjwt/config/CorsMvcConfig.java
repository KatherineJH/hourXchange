package com.example.oauthjwt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry corsRegistry) {
    // 프론트엔드와 백엔드가 다른 포트이므로 CORS 허용
    corsRegistry
        .addMapping("/**")
        .exposedHeaders("Set-Cookie") // 프론트에서 쿠키 읽을 수 있게
        .allowedOrigins("http://localhost:5173"); // 프론트 주소 허용
  }
}
