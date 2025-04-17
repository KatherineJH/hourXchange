package com.example.oauthjwt.controller.auth;

import com.example.oauthjwt.dto.ServiceProductReqDTO;
import com.example.oauthjwt.dto.ServiceProductResDTO;
import com.example.oauthjwt.entity.ProviderType;
import com.example.oauthjwt.service.CategoryService;
import com.example.oauthjwt.service.impl.SPImageServiceImpl;
import com.example.oauthjwt.service.ServiceProductService;
import com.example.oauthjwt.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/serviceProduct")
public class ServiceProductController {
    private final ServiceProductService serviceProductService;
    private final CategoryService categoryService;
    private final UserService userService;
    private final SPImageServiceImpl spImageServiceImpl;

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody ServiceProductReqDTO serviceProductReqDTO) {
        log.info(serviceProductReqDTO);
        // 사용자 조회
        Map<String, String> userCheck = userService.existsById(serviceProductReqDTO.getOwnerId());
        if(!userCheck.isEmpty()){ // 등록한 사용자의 id가 존재하지 않으면
            return ResponseEntity.badRequest().body(userCheck);
        }
        // 카테고리 조회
        Map<String, String> categoryCheck = categoryService.existsById(serviceProductReqDTO.getCategoryId());
        if(!categoryCheck.isEmpty()){ // 카테고리 id 값을 통해 값이 존재 하지 않으면
            return ResponseEntity.badRequest().body(categoryCheck);
        }
        // 이미지 주소 조회
        for(int i = 0; i < serviceProductReqDTO.getImages().size(); i++){
            Map<String, String> existsByImgUrlCheck = spImageServiceImpl.existsByImgUrl(serviceProductReqDTO.getImages().get(i));
            if(!existsByImgUrlCheck.isEmpty()){
                return ResponseEntity.badRequest().body(existsByImgUrlCheck);
            }
        }
        // 타입 조회
        Map<String, String> ProviderTypeCheck = ProviderType.existsByValue(serviceProductReqDTO.getProviderType());
        if(!ProviderTypeCheck.isEmpty()){ // 타입이 enum 항목에 존재하지 않으면
            return ResponseEntity.badRequest().body(ProviderTypeCheck);
        }
        // 로직 실행
        ServiceProductResDTO result = serviceProductService.save(serviceProductReqDTO);
        // 저장된 값 반환
        return ResponseEntity.ok(result);
    }

}
