package com.example.oauthjwt.dto.response;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

import java.util.List;

@JacksonXmlRootElement(localName = "response")
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class VollcolectionResponse {
    @JacksonXmlProperty(localName = "header")
    private Header header;

    @JacksonXmlProperty(localName = "body")
    private Body body;

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }
    @Data
    public static class Body {
        @JacksonXmlElementWrapper(localName = "items")
        @JacksonXmlProperty(localName = "item")
        private List<Item> items;
        @JacksonXmlProperty(localName = "numOfRows")
        private int numOfRows;

        @JacksonXmlProperty(localName = "pageNo")
        private int pageNo;

        @JacksonXmlProperty(localName = "totalCount")
        private int totalCount;
    }

    @Data
    public static class Item {
        private String seq; // *일련번호
        private String title; // *봉사명
        private String centName; // *관리센터
        private String reqName; // *수요처
        private String centCode; // *센터코드
        private String reqCode; // *수요처코드
        private String areaName; // 지역명
        private String place; // 장소
        private String reqCnt; // 필요인원
        private String partCnt; //참여인원
        private String regDate; // 등록일자
        private String actTypeName; // 활동명
        private String termType; // 활동구분
        private String termTypeName; // 활동구분명
        private String status; // 상태
        private String statusName; // 상태명
        private String teenager; // 청소년일감여부
    }
}
