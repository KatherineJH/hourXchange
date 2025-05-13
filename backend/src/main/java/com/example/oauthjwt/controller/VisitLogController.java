package com.example.oauthjwt.controller;

import com.example.oauthjwt.dto.response.VisitLogResponse;
import com.example.oauthjwt.service.VisitLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitLogController {
    private final VisitLogService visitLogService;

    @GetMapping("/daily")
    public List<VisitLogResponse> daily() {
        return visitLogService.getDailyCounts(14);  // 최근 30일
    }
    @GetMapping("/weekly")
    public List<VisitLogResponse> weekly() {
        return visitLogService.getWeeklyCounts(6); // 최근 12주
    }
    @GetMapping("/monthly")
    public List<VisitLogResponse> monthly() {
        return visitLogService.getMonthlyCounts(6); // 최근 12개월
    }
    @GetMapping("/yearly")
    public List<VisitLogResponse> yearly() {
        return visitLogService.getYearlyCounts(5);  // 최근 5년
    }
}
