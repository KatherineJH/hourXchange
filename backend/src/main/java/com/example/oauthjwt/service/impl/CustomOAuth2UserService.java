package com.example.oauthjwt.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.oauthjwt.dto.response.*;
import com.example.oauthjwt.dto.CustomOAuth2User;
import com.example.oauthjwt.entity.Wallet;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.UserRepository;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.client.RestTemplate;

@Service
@Log4j2
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;


    public CustomOAuth2UserService(UserRepository userRepository, RestTemplate restTemplate) {

        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {

            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("github")) {
            // 1) 기본 attributes 복사
            Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());

            // 2) email이 없으면 /user/emails 호출
            Object emailAttr = attributes.get("email");
            if (emailAttr == null || emailAttr.toString().isBlank()) {
                String token = userRequest.getAccessToken().getTokenValue();
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(token);
                HttpEntity<Void> entity = new HttpEntity<>(headers);

                // 이메일 리스트 조회
                ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                        "https://api.github.com/user/emails",
                        HttpMethod.GET,
                        entity,
                        new ParameterizedTypeReference<>() {
                        }
                );

                List<Map<String, Object>> emails = resp.getBody();
                String primaryEmail = emails.stream()
                        .filter(e -> Boolean.TRUE.equals(e.get("primary")) && Boolean.TRUE.equals(e.get("verified")))
                        .map(e -> e.get("email").toString())
                        .findFirst()
                        .orElseGet(() -> emails.isEmpty() ? "" : emails.get(0).get("email").toString());

                attributes.put("email", primaryEmail);
            }

            oAuth2Response = new GitHubResponse(attributes);

        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 OAuth2 공급자: " + registrationId);
        }

        Optional<User> existData = userRepository.findByEmail(oAuth2Response.getEmail()); // 이메일을 기준으로 조회

        if (existData.isEmpty()) { // 테이블에 유저가 없으면
            User user = User.of(oAuth2Response);

            Wallet wallet = Wallet.of(user);
            user.setWallet(wallet);

            User result = userRepository.save(user); // 저장 결과

            return new CustomOAuth2User(UserResponse.toDto(result));
        } else { // 있으면 최신화
            User existUser = existData.get(); // 존재하는 정보 get()

            existUser.setEmail(oAuth2Response.getEmail()); // 이메일
            existUser.setName(oAuth2Response.getName()); // 이름 최신화

            User result = userRepository.save(existUser); // 저장 결과

            return new CustomOAuth2User(UserResponse.toDto(result));
        }
    }
}
