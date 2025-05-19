package com.example.oauthjwt.service;

import com.google.cloud.dialogflow.v2.*;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

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
        InputStream credStream = new ClassPathResource("dialogflow-key.json").getInputStream();
        GoogleCredentials creds = GoogleCredentials.fromStream(credStream)
                .createScoped("https://www.googleapis.com/auth/cloud-platform");
        SessionsSettings settings = SessionsSettings.newBuilder()
                .setCredentialsProvider(() -> creds)
                .build();
        this.sessionsClient = SessionsClient.create(settings);
    }

    public String detectIntent(String message, String sessionId) throws Exception {
        SessionName session = SessionName.of(projectId, sessionId);
        TextInput textInput = TextInput.newBuilder()
                .setText(message)
                .setLanguageCode("ko-KR")
                .build();
        QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();
        DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);
        return response.getQueryResult().getFulfillmentText();
    }
}
