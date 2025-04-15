package com.example.oauthjwt.service;

import com.example.oauthjwt.entity.UserRole;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.*;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Log4j2
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {

            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {

            return null;
        }

        Optional<User> existData = userRepository.findByEmail(oAuth2Response.getEmail()); // 이메일을 기준으로 조회

        if (existData.isEmpty()) { // 테이블에 유저가 없으면
            User user = User.builder()
                    .username(oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId()) // 유저네임
                    .email(oAuth2Response.getEmail()) // 이메일
                    .name(oAuth2Response.getName())
                    .createdAt(LocalDateTime.now())
                    .role(UserRole.ROLE_USER)
                    .build();

            User result = userRepository.save(user); // 저장 결과

            UserDTO userDTO = UserDTO.builder() // 반환값 설정
                    .username(result.getUsername())
                    .name(result.getName())
                    .role(result.getRole().toString())
                    .build();

            return new CustomOAuth2User(userDTO);
        } else { // 있으면 최신화
            User existUser = existData.get(); // 존재하는 정보 get()

            existUser.setEmail(oAuth2Response.getEmail()); // 이메일
            existUser.setName(oAuth2Response.getName()); // 이름 최신화

            User result = userRepository.save(existUser); // 저장 결과

            UserDTO userDTO = UserDTO.builder() // 반환값 설정
                    .username(result.getUsername())
                    .name(result.getName())
                    .role(result.getRole().toString())
                    .build();

            return new CustomOAuth2User(userDTO);
        }
    }
}
