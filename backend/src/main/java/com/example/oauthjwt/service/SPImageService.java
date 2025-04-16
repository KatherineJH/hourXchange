package com.example.oauthjwt.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface SPImageService {
    Map<String, String> existsByImgUrl(String imgUrl);
}
