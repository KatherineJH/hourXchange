package com.example.oauthjwt.controller;


import com.example.oauthjwt.dto.response.CategoryResponse;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Log4j2
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<?> (@RequestBody CategoryResponse categoryResponse) {
        log.info(categoryResponse);
        try {
            CategoryResponse result = categoryService.save(categoryResponse);
        }
    }

}
