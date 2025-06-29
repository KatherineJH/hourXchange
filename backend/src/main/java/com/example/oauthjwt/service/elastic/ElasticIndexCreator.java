package com.example.oauthjwt.service.elastic;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ElasticIndexCreator {
    @Value("${url.elastic}")
    String urlElastic;

    private final RestTemplate restTemplate = new RestTemplate();

    public void createIndices() {
        createIndex("product_index", getProductIndexPayload());
        createIndex("board_index", getBoardIndexPayload());
        createIndex("donation_index", getDonationIndexPayload());
    }

    private void createIndex(String indexName, String payload) {
        String url = urlElastic + "/" + indexName;

        // 인덱스 존재 여부 확인
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println(indexName + " 인덱스가 이미 존재합니다.");
                return;
            }
        } catch (Exception e) {
            System.out.println(indexName + " 인덱스가 존재하지 않아 생성을 시도합니다.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        restTemplate.put(url, request);
        System.out.println(indexName + " 인덱스를 성공적으로 생성했습니다.");
    }

    private String getProductIndexPayload() { // "user_dictionary", "synonym_filter" 임시 삭제
        return """

                    {
                      "settings": {
                        "analysis": {
                          "analyzer": {
                            "my_custom_analyzer": {
                              "type": "custom",
                              "char_filter": [],
                              "tokenizer": "my_nori_tokenizer",
                              "filter": ["my_pos_filter", "lowercase_filter"]
                            },
                            "ngram_analyzer": {
                              "type": "custom",
                              "tokenizer": "ngram_tokenizer",
                              "filter": ["lowercase"]
                            }
                          },
                          "tokenizer": {
                            "my_nori_tokenizer": {
                              "type": "nori_tokenizer",
                              "decompound_mode": "mixed",
                              "discard_punctuation": "true",
                              "lenient": true
                            },
                            "ngram_tokenizer": {
                              "type": "ngram",
                              "min_gram": 3,
                              "max_gram": 4,
                              "token_chars": ["letter", "digit"]
                            }
                          },
                          "filter": {
                            "my_pos_filter": {
                              "type": "nori_part_of_speech"
                            },
                            "lowercase_filter": {
                              "type": "lowercase"
                            }
                          }
                        }
                      },
                      "mappings": {
                        "properties": {
                          "id": { "type": "long", "index": false },
                          "title": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" },
                              "ngram": { "type": "text", "analyzer": "ngram_analyzer" }
                            }
                          },
                          "description": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" },
                              "ngram": { "type": "text", "analyzer": "ngram_analyzer" }
                            }
                          },
                          "ownerName": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" }
                            }
                          },
                          "suggest": {
                            "type": "completion",
                            "analyzer": "my_custom_analyzer"
                          }
                        }
                      }
                    }
                """;
    }

    private String getBoardIndexPayload() {
        return """

                    {
                      "settings": {
                        "analysis": {
                          "analyzer": {
                            "my_custom_analyzer": {
                              "type": "custom",
                              "char_filter": [],
                              "tokenizer": "my_nori_tokenizer",
                              "filter": ["my_pos_filter", "lowercase_filter"]
                            }
                          },
                          "tokenizer": {
                            "my_nori_tokenizer": {
                              "type": "nori_tokenizer",
                              "decompound_mode": "mixed",
                              "discard_punctuation": "true",
                              "lenient": true
                            }
                          },
                          "filter": {
                            "my_pos_filter": {
                              "type": "nori_part_of_speech"
                            },
                            "lowercase_filter": {
                              "type": "lowercase"
                            }
                          }
                        }
                      },
                      "mappings": {
                        "properties": {
                          "id": { "type": "long", "index": false },
                          "title": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" }
                            }
                          },
                          "description": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" }
                            }
                          },
                          "authorName": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" }
                            }
                          },
                          "createdAt": { "type": "date" },
                          "suggest": {
                            "type": "completion",
                            "analyzer": "my_custom_analyzer"
                          }
                        }
                      }
                    }
                """;
    }
    private String getDonationIndexPayload() {
        return """

                    {
                      "settings": {
                        "analysis": {
                          "analyzer": {
                            "my_custom_analyzer": {
                              "type": "custom",
                              "char_filter": [],
                              "tokenizer": "my_nori_tokenizer",
                              "filter": ["my_pos_filter", "lowercase_filter"]
                            }
                          },
                          "tokenizer": {
                            "my_nori_tokenizer": {
                              "type": "nori_tokenizer",
                              "decompound_mode": "mixed",
                              "discard_punctuation": "true",
                              "lenient": true
                            }
                          },
                          "filter": {
                            "my_pos_filter": {
                              "type": "nori_part_of_speech"
                            },
                            "lowercase_filter": {
                              "type": "lowercase"
                            }
                          }
                        }
                      },
                      "mappings": {
                        "properties": {
                          "id": { "type": "long", "index": false },
                          "title": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" }
                            }
                          },
                          "description": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" }
                            }
                          },
                          "authorName": {
                            "type": "text",
                            "analyzer": "my_custom_analyzer",
                            "fields": {
                              "keyword": { "type": "keyword" }
                            }
                          },
                          "createdAt": { "type": "date" },
                          "suggest": {
                            "type": "completion",
                            "analyzer": "my_custom_analyzer"
                          }
                        }
                      }
                    }
                """;
    }
}
