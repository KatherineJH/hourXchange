package com.example.oauthjwt.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface CategoryService {

    Map<String, String> existsById(Long id);
}
