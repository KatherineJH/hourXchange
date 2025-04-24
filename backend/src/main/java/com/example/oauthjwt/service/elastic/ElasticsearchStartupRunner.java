package com.example.oauthjwt.service.elastic;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ElasticsearchStartupRunner {

    private final ElasticIndexCreator indexCreator;
    private final Indexer indexer;

    @PostConstruct
    public void init() {
        indexCreator.createIndices();
        indexer.indexAll();
        System.out.println("✅ Elasticsearch 자동 색인 완료");
    }
}