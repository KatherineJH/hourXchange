package com.example.oauthjwt.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// 임시 추가 로거. 추후 삭제해도 됨
@Slf4j
@Component
public class EnvCheckLogger {

    @Value("${ELASTIC_SERVER:NOT_DEFINED}")
    private String elasticServer;

    @Value("${ELASTIC_PORT:NOT_DEFINED}")
    private String elasticPort;

    @Value("${spring.elasticsearch.uris:NOT_SET}")
    private String elasticUri;

    @PostConstruct
    public void logElasticVars() {
        log.info("ELASTIC_SERVER: {}", elasticServer);
        log.info("ELASTIC_PORT: {}", elasticPort);
        log.info("spring.data.elasticsearch.uris: {}", elasticUri);
    }
}