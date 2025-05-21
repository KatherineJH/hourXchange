package com.example.oauthjwt.dto.response;

import java.util.Map;

public class GitHubResponse implements OAuth2Response{
    private final Map<String, Object> attributes;

    public GitHubResponse(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProvider() {
        return "github";
    }

    @Override
    public String getProviderId() {
        return String.valueOf(attributes.get("id"));
    }

    @Override
    public String getEmail() {
        // GitHub API 응답에 email이 없을 수 있으니 안전하게 처리
        return attributes.getOrDefault("email", "").toString();
    }

    @Override
    public String getName() {
        // name 필드가 없으면 login 필드를 대신 사용할 수도 있습니다.
        Object name = attributes.get("name");
        return name != null ? name.toString() : attributes.get("login").toString();
    }
}
