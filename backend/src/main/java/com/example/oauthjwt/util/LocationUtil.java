package com.example.oauthjwt.util;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Component
public class LocationUtil {
    /**
     * 현재 요청 URL 뒤에 /{id} 를 붙여 Location URI 생성
     */
    public URI createdLocation(Object id) {
        return ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
    }

    public URI createdLocationWithUrl(Object id, String url) {
        return UriComponentsBuilder
                .fromUriString(url)
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
    }
}
