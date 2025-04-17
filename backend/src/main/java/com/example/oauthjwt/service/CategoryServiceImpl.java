package com.example.oauthjwt.service;

import java.util.Collections;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
  private final CategoryRepository categoryRepository;

  public Map<String, String> existsById(Long id) {
    if (!categoryRepository.existsById(id)) {
      return Map.of("error", "해당 카테고리가 존재하지 않습니다.");
    }
    return Collections.emptyMap();
  }
}
