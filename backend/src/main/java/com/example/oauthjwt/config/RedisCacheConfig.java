package com.example.oauthjwt.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import java.time.Duration;

@Configuration
@EnableCaching
public class RedisCacheConfig {
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory cf) {
        RedisCacheConfiguration cfg = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5));  // 캐시 TTL
        return RedisCacheManager.builder(RedisCacheWriter.nonLockingRedisCacheWriter(cf))
                .cacheDefaults(cfg)
                .build();
    }
}
