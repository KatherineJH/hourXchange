package com.example.oauthjwt.service;

import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.CategoryDTO;
import com.example.oauthjwt.dto.ServiceProductDTO;
import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.repository.ServiceProductRepository;
import com.example.oauthjwt.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceProductServiceImpl implements ServiceProductService {

  private final ServiceProductRepository serviceProductRepository;
  private final UserRepository userRepository;
  private final CategoryRepository categoryRepository;

  public ServiceProductDTO save(ServiceProductDTO serviceProductDTO) {

    User owner = userRepository.findById(serviceProductDTO.getOwnerId()).get();
    Category category = categoryRepository.findById(serviceProductDTO.getCategoryId()).get();

    ServiceProduct serviceProduct =
        ServiceProduct.builder()
            .title(serviceProductDTO.getTitle())
            .description(serviceProductDTO.getDescription())
            .hours(serviceProductDTO.getHours())
            .startedAt(serviceProductDTO.getStartedAt())
            .endAt(serviceProductDTO.getEndAt())
            .owner(owner)
            .category(category)
            .providerType(ProviderType.valueOf(serviceProductDTO.getProviderType().toUpperCase()))
            .build();

    for (String url : serviceProductDTO.getImages()) {
      SPImage spImage = SPImage.builder().imgUrl(url).serviceProduct(serviceProduct).build();

      serviceProduct.getImages().add(spImage);
    }

    ServiceProduct result = serviceProductRepository.save(serviceProduct);
    UserDTO userDTO =
        UserDTO.builder()
            .id(result.getOwner().getId())
            .role(result.getOwner().getRole().toString())
            .name(result.getOwner().getName())
            .username(result.getOwner().getUsername())
            .email(result.getOwner().getEmail())
            .password(result.getOwner().getPassword())
            .createdAt(result.getOwner().getCreatedAt())
            .credit(result.getOwner().getCredit())
            .build();

    CategoryDTO categoryDTO =
        CategoryDTO.builder()
            .id(result.getCategory().getId())
            .categoryName(category.getCategoryName())
            .build();

    return ServiceProductDTO.builder()
        .id(result.getId())
        .title(result.getTitle())
        .description(result.getDescription())
        .hours(result.getHours())
        .startedAt(result.getStartedAt())
        .endAt(result.getEndAt())
        .owner(userDTO)
        .category(categoryDTO)
        .providerType(result.getProviderType().toString())
        .images(
            result.getImages().stream()
                .map(SPImage::getImgUrl)
                .collect(Collectors.toList())) // 이미지 엔티티에서 url만 String list로 변환
        .build();
  }
}
