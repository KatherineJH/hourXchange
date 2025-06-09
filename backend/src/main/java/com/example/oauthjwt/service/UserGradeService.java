package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

public interface UserGradeService {
    Map<String, Object> predictUserGrade(Map<String, Object> userInfo);

    Map<String, Object> predictUserGradeById(Long userId);

    List<Map<String, Object>> predictAllUserGrades();
}
