package com.example.oauthjwt.dto;

import com.example.oauthjwt.entity.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResDTO {
  private Long id;

  private String categoryName;

  public static CategoryResDTO toDto(Category category) {
    return CategoryResDTO.builder()
        .id(category.getId())
        .categoryName(category.getCategoryName())
        .build();
  }
}
