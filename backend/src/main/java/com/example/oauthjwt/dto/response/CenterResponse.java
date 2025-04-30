package com.example.oauthjwt.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.*;
import lombok.Data;

import java.util.List;

@JacksonXmlRootElement(localName = "response")
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class CenterResponse {

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
        private String centCode; // *봉사활동처 코드
        private String centName; // *봉사활동처명
        private String areaName; // *지역명
        private String centTypeName; // *분야명
        private String establishDate; // 설립일
        private String telNum; // 전화번호
        private String faxNum; // 팩스번호
        private String zipCode; // 우편번호
        private String addr; // 장소
        private String addrDetail; // 상세주소
        private String centMaster; // 대표자
        private String centWorker; // 담당자

    }
}
