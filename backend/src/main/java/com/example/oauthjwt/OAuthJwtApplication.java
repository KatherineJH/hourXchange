package com.example.oauthjwt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.log4j.Log4j2;

@SpringBootApplication
// @EnableScheduling // 스케줄링 기능 활성화
@Log4j2
public class OAuthJwtApplication {

    public static void main(String[] args) {
        SpringApplication.run(OAuthJwtApplication.class, args);
    }
}

