package com.example.oauthjwt.interceptor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.VisitLog;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.repository.VisitLogRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component // ① 스프링 빈으로 등록
@RequiredArgsConstructor // ② final 필드(repo)에 대한 생성자 자동 생성
public class VisitLogInterceptor implements HandlerInterceptor {

    private final VisitLogRepository visitLogRepository; // JPA Repository
    private final UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // 1) 요청 정보 수집
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null)
            ip = request.getRemoteAddr();

        String ua = request.getHeader("User-Agent");
        String url = request.getRequestURI();
        String ref = request.getHeader("Referer");

        // 2) SecurityContext에서 userId 추출 (JWT 방식 가정)
        String userEmail = null;
        Long userId = null;
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            userEmail = ((UserDetails) auth.getPrincipal()).getUsername();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
            userId = user.getId();
        }

        // 3) 엔티티 생성 후 저장
        VisitLog visitLog = VisitLog.of(userId, ip, ua, url, ref);

        visitLogRepository.save(visitLog);
        return true; // 다음 인터셉터 또는 컨트롤러로 계속 진행
    }
}
