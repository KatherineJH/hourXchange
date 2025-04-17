package com.example.oauthjwt.service.impl;

import java.util.Collections;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.ServiceProductReqDTO;
import com.example.oauthjwt.dto.ServiceProductResDTO;
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

  public ServiceProductResDTO save(ServiceProductReqDTO serviceProductReqDTO) {

    User owner = userRepository.findById(serviceProductReqDTO.getOwnerId()).get(); // 유저 조회
    Category category =
        categoryRepository.findById(serviceProductReqDTO.getCategoryId()).get(); // 카테고리 조회

    ServiceProduct serviceProduct =
        ServiceProduct.builder() // 저장할 객체 생성
            .title(serviceProductReqDTO.getTitle())
            .description(serviceProductReqDTO.getDescription())
            .hours(serviceProductReqDTO.getHours())
            .startedAt(serviceProductReqDTO.getStartedAt())
            .endAt(serviceProductReqDTO.getEndAt())
            .owner(owner)
            .category(category)
            .providerType(
                ProviderType.valueOf(serviceProductReqDTO.getProviderType().toUpperCase()))
            .build();

    for (String url : serviceProductReqDTO.getImages()) { // 이미지 url list 등록
      SPImage spImage = SPImage.builder().imgUrl(url).serviceProduct(serviceProduct).build();

      serviceProduct.getImages().add(spImage);
    }

    ServiceProduct result = serviceProductRepository.save(serviceProduct); // 저장 후 결과 반환

    return ServiceProductResDTO.toDto(result);
  }

  @Override
  public Map<String, String> existsById(Long id) {
    if (!serviceProductRepository.existsById(id)) { // id로 조회한 정보가 존재하지 않는 경우
      return Map.of("error", "제품를 찾을 수 없습니다.");
    }
    return Collections.emptyMap();
  }
}
