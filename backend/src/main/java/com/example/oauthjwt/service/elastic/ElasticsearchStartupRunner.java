package com.example.oauthjwt.service.elastic;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ElasticsearchStartupRunner {

    private final ElasticIndexCreator indexCreator;
    private final Indexer indexer;

    // @PostConstruct // 실행 시 자동 인덱싱
    public void init() {
        try {
            indexCreator.createIndices();
            indexer.indexAll();
            System.out.println("Elasticsearch 자동 색인 완료");
        } catch (Exception e) {
            System.out.println("Elasticsearch 연결 실패 (무시됨): " + e.getMessage());
        }
    }
}
