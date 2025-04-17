package com.example.oauthjwt.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public interface SPImageService {
  Map<String, String> existsByImgUrl(String imgUrl);
}
