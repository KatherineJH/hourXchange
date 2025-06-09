package com.example.oauthjwt.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // 1) ObjectMapper 생성 및 JavaTimeModule 등록
        ObjectMapper mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())                        // LocalDate/LocalDateTime 지원
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);     // ISO-8601 문자열로 저장

        // 2) Default Typing 활성화
        //    - NON_FINAL: final 클래스(예: String, Integer)는 제외하고, 나머지 모든 객체에 @class 주입
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        // 3) Jackson 기반 JSON 직렬화기 생성 (타입 정보 포함)
        GenericJackson2JsonRedisSerializer serializer =
                new GenericJackson2JsonRedisSerializer(mapper);

        // 4) 캐시 설정: TTL 10분, null 제외, JSON 직렬화 적용
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues()
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(serializer)
                );

        // 5) 캐시 이름별 구성 맵핑
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
//        cacheConfigs.put("productFindAll", defaultConfig.entryTtl(Duration.ofMinutes(1)));

        // 필요하다면 다른 캐시들도 여기에 추가 가능

        // 6) RedisCacheManager 빌드
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)                         // 나머지 캐시는 기본 설정 사용
                .withInitialCacheConfigurations(cacheConfigs)         // 지정한 캐시만 별도 설정
                .build();
    }
}
