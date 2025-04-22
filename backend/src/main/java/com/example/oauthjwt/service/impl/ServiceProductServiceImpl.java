package com.example.oauthjwt.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.repository.SPImageRepository;
import com.example.oauthjwt.service.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.request.ServiceProductRequest;
import com.example.oauthjwt.dto.response.ServiceProductResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.repository.ServiceProductRepository;
import com.example.oauthjwt.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Log4j2
public class ServiceProductServiceImpl implements ServiceProductService {

  private final ServiceProductRepository serviceProductRepository;
  private final UserRepository userRepository;
  private final CategoryRepository categoryRepository;
  private final SPImageRepository spImageRepository;


  public ServiceProductResponse save(ServiceProductRequest serviceProductRequest) {
    // 검증
    User owner = userRepository.findById(serviceProductRequest.getOwnerId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저 정보가 존재하지 않습니다."));
    Category category = categoryRepository.findById(serviceProductRequest.getCategoryId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));

    ProviderType providerType = ProviderType.parseProviderType(serviceProductRequest.getProviderType().toUpperCase());
    if(providerType == null){
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
    }
    // 이미지 리스트 생성
    List<SPImage> images = new ArrayList<>();
    if (serviceProductRequest.getImages() != null && !serviceProductRequest.getImages().isEmpty()) { // 이미지가 있는 경우에만 등록
      for (String url : serviceProductRequest.getImages()) { // 이미지 url list 등록
        if(spImageRepository.existsByImgUrl(url)){
          log.info("이미지 주소 중복");
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 주소가 중복되었습니다.");
        }
        SPImage spImage = SPImage.builder().imgUrl(url).build();

        images.add(spImage);
      }
    }
    // 저장할 객체 생성
    ServiceProduct serviceProduct = ServiceProduct.of(serviceProductRequest, owner, category, providerType, images);
    // 저장 후 결과 반환
    ServiceProduct result = serviceProductRepository.save(serviceProduct);
    return ServiceProductResponse.toDto(result);
  }



  @Override
  public ServiceProductResponse findById(Long id) {
    ServiceProduct serviceProduct = serviceProductRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));
    return ServiceProductResponse.toDto(serviceProduct);
  }

  @Override
  public ServiceProductResponse update(ServiceProductRequest serviceProductRequest) {
    // 검증
    ServiceProduct serviceProduct = serviceProductRepository.findById(serviceProductRequest.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "제품이 존재하지 않습니다."));
    Category category = categoryRepository.findById(serviceProductRequest.getCategoryId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));

    ProviderType providerType = ProviderType.parseProviderType(serviceProductRequest.getProviderType().toUpperCase());
    if(providerType == null){
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 타입입니다.");
    }
    // 이미지 리스트 생성
    List<SPImage> images = new ArrayList<>();
    if (serviceProductRequest.getImages() != null && !serviceProductRequest.getImages().isEmpty()) { // 이미지가 있는 경우에만 등록
      for (String url : serviceProductRequest.getImages()) { // 이미지 url list 등록
        if(spImageRepository.existsByImgUrl(url)){
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 주소가 중복되었습니다.");
        }
        SPImage spImage = SPImage.builder().imgUrl(url).serviceProduct(serviceProduct).build();
        images.add(spImage);
      }
    }
    // 저장 및 반환
    ServiceProduct result = serviceProductRepository.save(serviceProduct.setUpdateValue(serviceProductRequest, category, providerType, images));
    return ServiceProductResponse.toDto(result);
  }

  @Override
  public List<ServiceProductResponse> findAll() {
    List<ServiceProduct> serviceProductList = serviceProductRepository.findAll();

    return serviceProductList.stream().map(ServiceProductResponse::toDto).collect(Collectors.toList());
  }
}
