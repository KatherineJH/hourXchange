package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.response.CenterResponse;
import com.example.oauthjwt.dto.response.VollcolectionResponse;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.repository.CategoryRepository;
import com.example.oauthjwt.repository.ProductRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Log4j2
public class ScheduleServiceImpl {
    @Value("${openApi.key}")
    private String apiKey;

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final XmlMapper xmlMapper = new XmlMapper(); // Jackson XML

    private final // 코드 → [lat, lng] 를 문자열로 매핑
    Map<String, String[]> areaCenters = Map.ofEntries(
            Map.entry("0101", new String[]{"37.5665", "126.9780"}),  // 서울
            Map.entry("0102", new String[]{"35.1796", "129.0756"}),  // 부산
            Map.entry("0103", new String[]{"35.8714", "128.6014"}),  // 대구
            Map.entry("0104", new String[]{"37.4563", "126.7052"}),  // 인천
            Map.entry("0105", new String[]{"35.1595", "126.8526"}),  // 광주
            Map.entry("0106", new String[]{"36.3504", "127.3845"}),  // 대전
            Map.entry("0107", new String[]{"35.5396", "129.3114"}),  // 울산
            Map.entry("0117", new String[]{"36.4879", "127.2817"}),  // 세종
            Map.entry("0108", new String[]{"37.4138", "127.5183"}),  // 경기
            Map.entry("0109", new String[]{"37.8228", "128.1555"}),  // 강원
            Map.entry("0110", new String[]{"36.6358", "127.4910"}),  // 충북
            Map.entry("0111", new String[]{"36.5160", "126.8000"}),  // 충남
            Map.entry("0112", new String[]{"35.7175", "127.1530"}),  // 전북
            Map.entry("0113", new String[]{"34.8678", "126.9910"}),  // 전남
            Map.entry("0114", new String[]{"36.4919", "128.8889"}),  // 경북
            Map.entry("0115", new String[]{"35.4606", "128.2132"}),  // 경남
            Map.entry("0116", new String[]{"33.4996", "126.5312"})   // 제주
    );


    // 매시간 정각에 실행(예: 0분 0초마다)
    @Scheduled(cron = "50 * * * * *")
    public void fetchAndSaveCenter() { // 처음 초기화용
        int count = 1;
        while(true) {
            log.info(apiKey);
            String url = "http://apis.data.go.kr/B460014/vmsdataview/getCenterList";
            UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(url)
                    .queryParam("serviceKey", apiKey)
                    .queryParam("numOfRows", 500) // 500건씩 저장
                    .queryParam("pageNo", count) // 1페이지부터
                    .build(true); // 추가 인코딩 x
//                .queryParam("areaCode", "0101");

            String xml = restTemplate.getForObject(uriComponents.toUri(), String.class);

            log.info(xml);
            try {
                CenterResponse response = xmlMapper.readValue(xml, CenterResponse.class);
                log.info(response);
                List<User> userList = response.getBody().getItems().stream()
                        .map(item -> {
                            Address address = Address.of(item);
                            User user = User.of(item, address);
                            address.setUser(user);
                            return user;
                        })
                        .collect(Collectors.toList());

                userRepository.saveAll(userList);
                log.info("자원봉사 데이터 {}건 저장 완료", userList.size());
                count++;
                if (response.getBody().getNumOfRows() != response.getBody().getTotalCount()) { // 다른경우 마지막 페이지
                    break;
                }
            } catch (JsonProcessingException e) {
                log.error("XML 파싱 에러", e);
            }
        }
    }

    // 매시간 정각에 실행(예: 0분 0초마다)
    @Scheduled(cron = "10 * * * * *")
    public void fetchAndSaveVollcolection() { // 처음 초기화용

        areaCenters.forEach((areaCode, position) -> {
            int count = 1;
            while(true) {
                log.info(apiKey);
                String url = "http://apis.data.go.kr/B460014/vmsdataview/getVollcolectionList";
                UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(url)
                        .queryParam("serviceKey", apiKey)
                        .queryParam("numOfRows", 500) // 500건씩 저장
                        .queryParam("pageNo", count) // 1페이지부터
                        .queryParam("strDate", LocalDate.now().minusMonths(4).toString()) // 4달 전부터
                        .queryParam("endDate", LocalDate.now().toString()) // 오늘까지
                        .queryParam("areaCode", areaCode)
                        .build(true); // 추가 인코딩 x

                String xml = restTemplate.getForObject(uriComponents.toUri(), String.class);

                log.info(xml);
                try {
                    VollcolectionResponse response = xmlMapper.readValue(xml, VollcolectionResponse.class);
                    log.info(response);
                    List<Product> productList = response.getBody().getItems().stream()
                            .flatMap(item -> {
                                Optional<User> user = userRepository.findByEmail(item.getCentCode());
                                if(!user.isPresent()) {
                                    return Stream.empty(); // 없을 경우 패스
                                }

                                Category category = categoryRepository.findById(1L)
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "카테고리 정보가 존재하지 않습니다."));
                                ProviderType providerType = ProviderType.VOLUNTEER; // 자원봉사

                                return Stream.of(Product.of(item, user.get(), category, providerType, position));
                            })
                            .collect(Collectors.toList());

                    productRepository.saveAll(productList);
                    log.info("자원봉사 데이터 {}건 저장 완료", productList.size());
                    count++;
                    if (response.getBody().getNumOfRows() != response.getBody().getTotalCount()) { // 다른경우 마지막 페이지
                        break;
                    }
                } catch (JsonProcessingException e) {
                    log.error("XML 파싱 에러", e);
                }
            }
        });

    }









}
