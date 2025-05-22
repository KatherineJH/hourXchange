package com.example.oauthjwt.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplateBuilder를 사용해 RestTemplate 빈을 생성합니다.
     * 필요한 경우 timeout, messageConverters 등 추가 설정이 가능합니다.
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                // 예: 커넥션 타임아웃·리드 타임아웃 설정
                // .setConnectTimeout(Duration.ofSeconds(5))
                // .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }
}
