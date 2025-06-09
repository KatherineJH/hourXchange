package com.example.oauthjwt.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.oauthjwt.service.TimeSeriesServiece;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimeSeriesServieceImpl implements TimeSeriesServiece {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${url.flask}/forecast/predict")
    private String flaskUrl;

    @Value("${url.flask}/donation/predict")
    private String flaskUrl2;

    @Override
    public List<Map<String, Object>> getForecast(List<Map<String, Object>> history, int periods) {
        try {
            if (history == null || history.size() < 30) {
                return fail("⚠ 최소 30일 이상 데이터가 필요합니다.");
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> request = Map.of("history", history, "periods", periods);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<List> response = restTemplate.postForEntity(flaskUrl, entity, List.class);
            return response.getBody();
        } catch (Exception e) {
            return fail("⚠ 예측 실패: 서버 또는 데이터 오류");
        }
    }
    private List<Map<String, Object>> fail(String message) {
        return List.of(Map.of("error", message));
    }

    @Override
    public Map<String, Object> predictDonation(Map<String, Object> features) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(features, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl2, entity, Map.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("error", "기부 예측 실패: 서버 또는 데이터 오류");
        }
    }
}
