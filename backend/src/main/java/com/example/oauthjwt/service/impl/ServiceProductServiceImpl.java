package com.example.oauthjwt.service.impl;

import java.util.Collections;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.request.ServiceProductUpdateRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.repository.ServiceProductRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.ServiceProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceProductServiceImpl implements ServiceProductService {

  private final ServiceProductRepository serviceProductRepository;
  private final UserRepository userRepository;
  private final CategoryRepository categoryRepository;

  @Override
  public Map<String, String> existsById(Long id) {
    if (!serviceProductRepository.existsById(id)) { // id로 조회한 정보가 존재하지 않는 경우
      return Map.of("error", "제품를 찾을 수 없습니다.");
    }
    return Collections.emptyMap();
  }

  public ServiceProductResponse save(ServiceProductRequest serviceProductRequest) {

    User owner = userRepository.findById(serviceProductRequest.getOwnerId()).get(); // 유저 조회
    Category category =
        categoryRepository.findById(serviceProductRequest.getCategoryId()).get(); // 카테고리 조회

    ServiceProduct serviceProduct =
        ServiceProduct.builder() // 저장할 객체 생성
            .title(serviceProductRequest.getTitle())
            .description(serviceProductRequest.getDescription())
            .hours(serviceProductRequest.getHours())
            .startedAt(serviceProductRequest.getStartedAt())
            .endAt(serviceProductRequest.getEndAt())
            .owner(owner)
            .category(category)
            .providerType(
                ProviderType.valueOf(serviceProductRequest.getProviderType().toUpperCase()))
            .build();

    if (serviceProductRequest.getImages() != null
        && !serviceProductRequest.getImages().isEmpty()) { // 이미지가 있는 경우에만 등록
      for (String url : serviceProductRequest.getImages()) { // 이미지 url list 등록
        SPImage spImage = SPImage.builder().imgUrl(url).serviceProduct(serviceProduct).build();

        serviceProduct.getImages().add(spImage);
      }
    }

    ServiceProduct result = serviceProductRepository.save(serviceProduct); // 저장 후 결과 반환

    return ServiceProductResponse.toDto(result);
  }

  @Override
  public ServiceProductResponse findById(Long id) {
    return ServiceProductResponse.toDto(serviceProductRepository.findById(id).get());
  }

  @Override
  public ServiceProductResponse update(ServiceProductUpdateRequest serviceProductUpdateRequest) {
    ServiceProduct serviceProduct =
        serviceProductRepository.findById(serviceProductUpdateRequest.getId()).get(); // 제품 조회

    Category category =
        categoryRepository.findById(serviceProductUpdateRequest.getCategoryId()).get(); // 카테고리 조회

    serviceProductUpdateRequest.setCategory(category); // 카테고리 DTO에 등록

    ServiceProduct result =
        serviceProductRepository.save(
            serviceProduct.setUpdateValue(serviceProductUpdateRequest)); // 값 수정

    return ServiceProductResponse.toDto(result); // 반환
  }
}
