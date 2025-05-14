package com.example.oauthjwt.config;

import java.net.URI;
import java.util.Arrays;
import java.util.Map;

import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.example.oauthjwt.jwt.JWTUtil;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JWTUtil jwtUtil;
    private static final Logger log = LoggerFactory.getLogger(JwtHandshakeInterceptor.class);

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {

        log.info("⚠️ [HandshakeInterceptor] executed");
        URI uri = request.getURI();
        String query = uri.getQuery(); // ?token=eyJ...
        log.info("🔐 WebSocket Request: {}", query);

        if (query != null) {
            String token = Arrays.stream(query.split("&")).filter(param -> param.startsWith("token="))
                    .map(param -> param.substring("token=".length())).findFirst().orElse(null);

            if (token != null) {
                log.info("🧪 JWT Checking...: {}", token);

                Claims claims = jwtUtil.getClaims(token); // 여기서 토큰 검증도 같이 함

                String email = claims.get("email", String.class);
                attributes.put("userId", email);
                log.info("✅ User Verified: {}", email);
                return true;


            }
        }
        return false; // 인증 실패 시 false 반환
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Exception exception) {
        log.info("🔁 After handshake executed");
    }
}
