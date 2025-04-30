package com.example.oauthjwt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// @EnableScheduling // 스케줄링 기능 활성화
public class OAuthJwtApplication {

  public static void main(String[] args) {
    SpringApplication.run(OAuthJwtApplication.class, args);
  }
}
