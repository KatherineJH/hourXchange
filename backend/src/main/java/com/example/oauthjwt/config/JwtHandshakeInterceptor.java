package com.example.oauthjwt.config;


import com.example.oauthjwt.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

  private final JWTUtil jwtUtil;

  @Override
  public boolean beforeHandshake(
      ServerHttpRequest request,
      ServerHttpResponse response,
      WebSocketHandler wsHandler,
      Map<String, Object> attributes) {
    System.out.println("⚠️ [HandshakeInterceptor] executed");
    String query = request.getURI().getQuery();
    System.out.println("🔐 WebSocket Request: " + query);

    if (query != null && query.contains("token=")) {
      String token = query.split("token=")[1];
      System.out.println("🧪 JWT Checking...: " + token);
      if (jwtUtil.isExpired(token)) {
        String username = jwtUtil.getUsername(token);
        attributes.put("userId", username); // 👈 로그인 한 유저만 WebSocket 허용
        System.out.println("✅ User Verified: " + username);
        return true;
      }
    }
    System.out.println("❌ JWT authentication Failed"); // ❌ 인증 실패 시 연결 차단
    return false;
  }

  @Override
  public void afterHandshake(
      ServerHttpRequest request,
      ServerHttpResponse response,
      WebSocketHandler wsHandler,
      Exception exception) {}
}
