package com.example.oauthjwt.service;

import java.util.Map;

public interface UserGradeService {
    Map<String, Object> predictUserGrade(Map<String, Object> userInfo);
}
