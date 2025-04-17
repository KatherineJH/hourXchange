package com.example.oauthjwt.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public interface CategoryService {

  Map<String, String> existsById(Long id);
}
