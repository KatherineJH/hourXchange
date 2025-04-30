package com.example.oauthjwt.service.impl;

import java.util.Collections;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.repository.SPImageRepository;
import com.example.oauthjwt.service.SPImageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SPImageServiceImpl implements SPImageService {
    private final SPImageRepository spImageRepository;

    public Map<String, String> existsByImgUrl(String imgUrl) {
        if (spImageRepository.existsByImgUrl(imgUrl)) {
            return Map.of("error", "중복된 이미지 주소입니다.");
        }
        return Collections.emptyMap();
    }
}
