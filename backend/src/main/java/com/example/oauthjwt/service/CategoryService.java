package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

import com.example.oauthjwt.dto.response.CategoryResponse;
import org.springframework.stereotype.Service;


public interface CategoryService {

  List<CategoryResponse> findAll();
}
