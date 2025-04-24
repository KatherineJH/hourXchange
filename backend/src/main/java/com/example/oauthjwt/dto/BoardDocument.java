package com.example.oauthjwt.dto;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.core.suggest.Completion;

import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Document(indexName = "board_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDocument {

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String title;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String description;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String authorName;

    @Field(type = FieldType.Date)
    private LocalDateTime createdAt;

    @Field(type = FieldType.Search_As_You_Type)
    private Completion suggest;
}