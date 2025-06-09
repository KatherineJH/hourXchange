package com.example.oauthjwt.dto.request;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description; // 게시글 내용

    @NotNull
    private Long categoryId; // 카테고리 id

    private List<String> images = new ArrayList<>(); // 이미지 url
}
