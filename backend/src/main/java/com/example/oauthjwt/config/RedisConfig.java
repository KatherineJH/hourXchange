package com.example.oauthjwt.config;

import com.example.oauthjwt.dto.document.DonationDocument;
import com.example.oauthjwt.dto.response.PageResult;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    @Primary   // 기본 redisTemplate 대신 이 빈을 쓰도록 우선 지정
    public RedisTemplate<String, PageResult<DonationDocument>> donationRedisTemplate(
            RedisConnectionFactory cf,
            ObjectMapper springObjectMapper) {
        RedisTemplate<String, PageResult<DonationDocument>> template = new RedisTemplate<>();
        template.setConnectionFactory(cf);

        // 1) ObjectMapper 복사
        ObjectMapper mapper = springObjectMapper.copy();
        // 2) NON_FINAL 타입에 @class 주입
        mapper.activateDefaultTyping(
                mapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        // 3) 이 mapper 로 Serializer 생성
        GenericJackson2JsonRedisSerializer ser = new GenericJackson2JsonRedisSerializer(mapper);
        template.setValueSerializer(ser);
        template.setKeySerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }
}