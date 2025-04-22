package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.entity.Category;
import org.springframework.stereotype.Service;


public interface CategoryService {

  Map<String, String> existsById(Long id);
  Category addCategory(String categoryName);
  Category updateCategory(Long id, String categoryName);
  Category findById(Long id);
  List<Category> findAll();
}
