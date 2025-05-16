package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.service.TimeSeriesServiece;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TimeSeriesServieceImpl implements TimeSeriesServiece {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${url.flask}/forecast/predict")
    private String flaskUrl;

    @Override
    public List<Map<String, Object>> getForecast(List<Map<String, Object>> history) {
        // 요청 구성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> request = Map.of("history", history);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        // 응답 파싱
        ResponseEntity<List> response = restTemplate.postForEntity(
                flaskUrl,
                entity,
                List.class
        );

        return response.getBody();
    }
}
