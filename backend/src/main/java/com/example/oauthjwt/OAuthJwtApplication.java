package com.example.oauthjwt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import lombok.extern.log4j.Log4j2;

@SpringBootApplication
@Log4j2
@EnableCaching
public class OAuthJwtApplication {

    public static void main(String[] args) {
        SpringApplication.run(OAuthJwtApplication.class, args);
    }
}
