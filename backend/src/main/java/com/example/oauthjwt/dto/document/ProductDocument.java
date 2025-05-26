package com.example.oauthjwt.dto.document;

import java.time.format.DateTimeFormatter;
import java.util.List;

import com.example.oauthjwt.entity.Product;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import jakarta.persistence.Id;
import lombok.*;

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

    @Field(type = FieldType.Date)
    private String createdAt;

    private List<String> suggest;

    public static ProductDocument toDocument(Product product, String ownerName, List<String> finalKeywords) {
        String formattedCreatedAt = (product.getCreateAt() != null)
                ? product.getCreateAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null;
        return ProductDocument.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .ownerName(ownerName)
                .createdAt(formattedCreatedAt)
                .suggest(finalKeywords)
                .build();
    }
}
