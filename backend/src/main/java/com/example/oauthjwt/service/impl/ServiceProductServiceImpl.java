package com.example.oauthjwt.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.oauthjwt.service.*;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.request.ServiceProductUpdateRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;
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
  private final UserService userService;
  private final CategoryService categoryService;
  private final SPImageService spImageService;


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

  @Override
  public List<ServiceProductResponse> findAll() {
    List<ServiceProduct> serviceProductList = serviceProductRepository.findAll();

    return serviceProductList.stream().map(ServiceProductResponse::toDto).collect(Collectors.toList());
  }

  @Override
  public Map<String, String> saveCheck(ServiceProductRequest serviceProductRequest) {
    Map<String, String> userCheck = userService.existsById(serviceProductRequest.getOwnerId());
    if (!userCheck.isEmpty()) { // 등록한 사용자의 id가 존재하지 않으면
      return userCheck;
    }
    // 카테고리가 있는지 조회
    Map<String, String> categoryCheck =
            categoryService.existsById(serviceProductRequest.getCategoryId());
    if (!categoryCheck.isEmpty()) { // 카테고리 id 값을 통해 값이 존재 하지 않으면
      return categoryCheck;
    }
    // 이미지 주소가 이미 있는지 조회
    for (int i = 0; i < serviceProductRequest.getImages().size(); i++) {
      Map<String, String> existsByImgUrlCheck =
              spImageService.existsByImgUrl(serviceProductRequest.getImages().get(i));
      if (!existsByImgUrlCheck.isEmpty()) {
        return existsByImgUrlCheck;
      }
    }
    // 타입이 있는지 조회
    Map<String, String> ProviderTypeCheck =
            ProviderType.existsByValue(serviceProductRequest.getProviderType());
    if (!ProviderTypeCheck.isEmpty()) { // 타입이 enum 항목에 존재하지 않으면
      return ProviderTypeCheck;
    }

    return Collections.emptyMap();
  }

  @Override
  public Map<String, String> updateCheck(ServiceProductUpdateRequest serviceProductUpdateRequest, CustomUserDetails customUserDetails) {
    // 제품이 있는지 조회
    Map<String, String> serviceProductCheck = existsById(serviceProductUpdateRequest.getId());
    if (!serviceProductCheck.isEmpty()) {
      return serviceProductCheck;
    }
    // 사용자가 있는지 조회
    Map<String, String> userCheck = userService.existsById(serviceProductUpdateRequest.getOwnerId());
    if (!userCheck.isEmpty()) { // 등록한 사용자의 id가 존재하지 않으면
      return userCheck;
    }
    // 카테고리가 있는지 조회
    Map<String, String> categoryCheck =
            categoryService.existsById(serviceProductUpdateRequest.getCategoryId());
    if (!categoryCheck.isEmpty()) { // 카테고리 id 값을 통해 값이 존재 하지 않으면
      return categoryCheck;
    }
    // 이미지 주소가 이미 있는지 조회
    for (int i = 0; i < serviceProductUpdateRequest.getImages().size(); i++) {
      Map<String, String> existsByImgUrlCheck =
              spImageService.existsByImgUrl(serviceProductUpdateRequest.getImages().get(i));
      if (!existsByImgUrlCheck.isEmpty()) {
        return existsByImgUrlCheck;
      }
    }
    // 요청한 사용자와 토큰에 등록된 사용자가 같은지 조회
    Map<String, String> userEqualsCheck =
            userService.isEquals(
                    serviceProductUpdateRequest.getOwnerId(), customUserDetails.getUser().getId());
    if (!userEqualsCheck.isEmpty()) { // 요청한 사용자와 쿠키를 통해 가져온 사용자의 아이디가 다른경우
      return userEqualsCheck;
    }

    return Collections.emptyMap();
  }

  @Override
  public Map<String, String> existsById(Long id) {
    if (!serviceProductRepository.existsById(id)) { // id로 조회한 정보가 존재하지 않는 경우
      return Map.of("error", "제품를 찾을 수 없습니다.");
    }
    return Collections.emptyMap();
  }
}
