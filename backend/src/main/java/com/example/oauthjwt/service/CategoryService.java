package com.example.oauthjwt.service;

import java.util.Map;

import com.example.oauthjwt.entity.Category;
import org.springframework.stereotype.Service;


public interface CategoryService {

  Map<String, String> existsById(Long id);
  Category create(String categoryName);
  Category update(Long id, String categoryName);
}
