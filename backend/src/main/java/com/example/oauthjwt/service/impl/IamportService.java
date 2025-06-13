package com.example.oauthjwt.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.example.oauthjwt.dto.response.PaymentResponse;
import com.example.oauthjwt.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class IamportService {

    private final RestTemplate rt = new RestTemplate();
    private final PaymentService paymentService;

    @Value("${iamport.api-key}")
    private String apiKey;

    @Value("${iamport.api-secret}")
    private String apiSecret;

    /** 1) 아임포트 토큰 발급 */
    public String getToken() {
        String url = "https://api.iamport.kr/users/getToken";

        // form-urlencoded 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // form 데이터 바디 구성
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("imp_key", apiKey);
        form.add("imp_secret", apiSecret);

        // HttpEntity에 헤더 + 바디 담기
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        // POST 요청
        ResponseEntity<Map> resp = rt.exchange(url, HttpMethod.POST, request, Map.class);

        // 응답에서 access_token 추출
        Map response = (Map) resp.getBody().get("response");
        return (String) response.get("access_token");
    }

    /** 2) 결제 검증 (imp_uid로 조회) */
    public PaymentResponse transaction(Map<String, String> data) {
        String impUid = data.get("imp_uid");

        String token = getToken();

        // Bearer 토큰 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        String url = "https://api.iamport.kr/payments/" + impUid;
        ResponseEntity<Map> resp = rt.exchange(url, HttpMethod.GET, entity, Map.class);

        Map response = (Map) resp.getBody().get("response"); // 바디에 있는 값만 추출

        // 1) merchant_uid 일치 확인
        if (!response.get("merchant_uid").equals(data.get("merchant_uid"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "결제 정보가 일치하지 않습니다.");
        }
        log.info(data);
        // 응답에서 payment 정보 반환
        return paymentService.save(response);
    }
}
