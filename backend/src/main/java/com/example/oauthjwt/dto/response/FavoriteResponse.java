package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Favorite;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteResponse {
  private Long id;
  private ProductResponse product;
  private UserResponse user;
  private boolean status;

  public static FavoriteResponse toDto(Favorite favorite) {
    return FavoriteResponse.builder().id(favorite.getId()).product(ProductResponse.toDto(favorite.getProduct()))
        .user(UserResponse.toDto(favorite.getUser())).status(favorite.isStatus()).build();
  }
}
