package com.example.oauthjwt.controller;

import com.example.oauthjwt.service.UserGradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user-grade")
public class UserGradeController {

    private final UserGradeService userGradeService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> predictUserGrade(@RequestBody Map<String, Object> userInput) {
        Map<String, Object> result = userGradeService.predictUserGrade(userInput);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUserGrades() {
        return ResponseEntity.ok(userGradeService.predictAllUserGrades());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserGrade(@PathVariable Long userId) {
        return ResponseEntity.ok(userGradeService.predictUserGradeById(userId));
    }
}
