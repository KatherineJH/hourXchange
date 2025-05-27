package com.example.oauthjwt.dto.document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.entity.Donation;
import com.example.oauthjwt.entity.DonationImage;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.type.DonationStatus;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.Id;
import lombok.*;

@Document(indexName = "donation_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationDocument {

    @Id
    private Long id;

    private String purpose; // 모집목적

    private int currentAmount; // 현재모집목표액

    private int targetAmount; // 모집목표액

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String title; // 제목

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String description; // 설명

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String authorName; // 작성자명

    private LocalDate startDate; // 모집시작일

    private LocalDate endDate; // 모집끝일

    @Field(type = FieldType.Date)
    private String createdAt; // 생성일자

    private int viewCount; // 조회수

    private UserResponse author; // 작성자

    private String status; // 상태

    private List<String> images  = new ArrayList<>(); // 이미지 리스트;

    private List<String> suggest;

    public static DonationDocument toDocument(Donation donation, String authorName, List<String> finalKeywords) {
        return DonationDocument.builder()
                .id(donation.getId())
                .purpose(donation.getPurpose())
                .currentAmount(donation.getCurrentAmount())
                .targetAmount(donation.getTargetAmount())
                .title(donation.getTitle())
                .description(donation.getDescription())
                .authorName(authorName)
                .startDate(donation.getStartDate())
                .endDate(donation.getEndDate())
                .createdAt(donation.getCreatedAt()
                        .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .viewCount(donation.getViewCount())
                .author(UserResponse.toDto(donation.getAuthor()))
                .status(donation.getStatus().toString().equals("ONGOING") ? "진행중" :
                        donation.getStatus().toString().equals("COMPLETE") ? "완료" : "취소")
                .images(donation.getImages().stream()
                        .map(DonationImage::getImgUrl)
                        .collect(Collectors.toList()))
                .suggest(finalKeywords)
                .build();
    }
}
