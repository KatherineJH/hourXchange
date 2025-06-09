package com.example.oauthjwt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.oauthjwt.interceptor.VisitLogInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final VisitLogInterceptor visitLogInterceptor;

    public WebConfig(VisitLogInterceptor visitLogInterceptor) {
        this.visitLogInterceptor = visitLogInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(visitLogInterceptor).addPathPatterns("/**"); // 모든 요청에 적용
    }
}
