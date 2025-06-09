package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long id;

    private String categoryName;

    private boolean status;

    public static CategoryResponse toDto(Category category) {
        return CategoryResponse.builder().id(category.getId()).categoryName(category.getCategoryName())
                .status(category.isStatus()).build();
    }
}
