package com.example.oauthjwt.service;

import com.example.oauthjwt.repository.SPImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SPImageServiceImpl implements SPImageService {
    private final SPImageRepository spImageRepository;

    public Map<String, String> existsByImgUrl(String imgUrl) {
        if(spImageRepository.existsByImgUrl(imgUrl)){
            return Map.of("error", "중복된 이미지 주소입니다.");
        }
        return Collections.emptyMap();
    }
}
