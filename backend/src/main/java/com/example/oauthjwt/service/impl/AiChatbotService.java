package com.example.oauthjwt.service.impl;

import com.google.cloud.dialogflow.v2.*;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.PostConstruct;
import java.io.InputStream;

@Service
public class AiChatbotService {
    private SessionsClient sessionsClient;
    private String projectId;

    @Value("${dialogflow.project-id}")
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    @PostConstruct
    private void init() throws Exception {
        // 계정 키 파일 로드
        InputStream credStream = new ClassPathResource("dialogflow-key.json").getInputStream();
        // 자격 증명 생성
        GoogleCredentials creds = GoogleCredentials.fromStream(credStream)
                .createScoped("https://www.googleapis.com/auth/cloud-platform");
        // 세션 설정 구성 자격 증명 등록
        SessionsSettings settings = SessionsSettings.newBuilder()
                .setCredentialsProvider(() -> creds)
                .build();
        // 실제 Dialogflow 세션 클라이언트 생성
        this.sessionsClient = SessionsClient.create(settings);
    }

    public String detectIntent(String message, String sessionId) {
        try {
            // 세션 입력 텍스트 설정 고유 세션 네임스페이스 생성
            SessionName session = SessionName.of(projectId, sessionId);
            TextInput textInput = TextInput.newBuilder()
                    .setText(message)
                    .setLanguageCode("ko-KR")
                    .build();
            // 쿼리 래핑 입력 받은 값을 담아 래핑
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();
            // Dialogflow와 통신 후 Response 반환
            DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);
            // 답변 값만 반환
            return response.getQueryResult().getFulfillmentText();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "aiChatbot 처리 과정 중 에러가 발생했습니다.");
        }
    }
}
