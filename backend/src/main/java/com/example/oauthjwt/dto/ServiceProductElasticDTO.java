package com.example.oauthjwt.dto;

import com.example.oauthjwt.entity.ServiceProduct;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "service_product_index")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ServiceProductElasticDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String providerType;
    private String ownerName;
//    private LocalDateTime created;

    public static ServiceProductElasticDTO fromEntity(ServiceProduct sp) {
        return new ServiceProductElasticDTO(
                sp.getId(),
                sp.getTitle(),
                sp.getDescription(),
                sp.getCategory().getCategoryName(),
                sp.getProviderType().name(),
                sp.getOwner().getName()
//                ,sp.getCreatedAt()
        );
    }
}
