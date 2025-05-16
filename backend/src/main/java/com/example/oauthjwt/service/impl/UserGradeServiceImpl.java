package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.service.UserGradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserGradeServiceImpl implements UserGradeService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${url.flask}/user-grade/predict")
    private String flaskUrl;

    @Override
    public Map<String, Object> predictUserGrade(Map<String, Object> userInfo) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(userInfo, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                flaskUrl,
                entity,
                Map.class
        );

        return response.getBody();
    }
}

