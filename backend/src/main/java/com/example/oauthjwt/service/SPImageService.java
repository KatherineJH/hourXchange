package com.example.oauthjwt.service;

import java.util.Map;

public interface SPImageService {
    Map<String, String> existsByImgUrl(String imgUrl);
}
