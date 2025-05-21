package com.example.oauthjwt.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.oauthjwt.entity.type.DonationStatus;
import jakarta.persistence.Column;
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

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String title;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String description;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String authorName;

    private int currentAmount; // 현재모집목표액

    private int targetAmount; // 모집목표액

    private LocalDate startDate; // 모집시작일

    private LocalDate endDate; // 모집끝일

    private String status;

    @Field(type = FieldType.Date)
    private LocalDateTime createdAt;

    private List<String> suggest;

    private List<String> images  = new ArrayList<>(); // 이미지 리스트;
}
