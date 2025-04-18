package com.example.oauthjwt.dto.request;

import com.example.oauthjwt.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardRequest {

    private Long id; // 게시글 id

    private Long authorId;; // 작성자 id

    private String title;

    private List<String> images = new ArrayList<>(); // 이미지 url

    private Category category; // 카테고리

    private Long categoryId; // 카테고리 id

    private String description; // 게시글 내용
}
