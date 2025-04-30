package com.example.oauthjwt.dto;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.Id;
import lombok.*;

import java.util.List;

@Document(indexName = "product_index")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDocument {

    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String title;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String description;

    @Field(type = FieldType.Text, analyzer = "my_custom_analyzer")
    private String ownerName;

    private List<String> suggest;
}