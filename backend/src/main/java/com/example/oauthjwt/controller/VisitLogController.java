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

    /** 요청 횟수 기준 */
    @GetMapping("/daily")
    public List<VisitLogResponse> daily() {
        return visitLogService.getDailyCounts(14);
    }

    @GetMapping("/weekly")
    public List<VisitLogResponse> weekly() {
        return visitLogService.getWeeklyCounts(6);
    }

    @GetMapping("/monthly")
    public List<VisitLogResponse> monthly() {
        return visitLogService.getMonthlyCounts(6);
    }

    @GetMapping("/yearly")
    public List<VisitLogResponse> yearly() {
        return visitLogService.getYearlyCounts(5);
    }

    // --- 고유 사용자 수(UV) 기준 ---
    /** 일별 고유 방문자 수 */
    @GetMapping("/daily/unique")
    public List<VisitLogResponse> dailyUnique() {
        return visitLogService.getDailyUniqueCounts(14);
    }

    /** 주별 고유 방문자 수 */
    @GetMapping("/weekly/unique")
    public List<VisitLogResponse> weeklyUnique() {
        return visitLogService.getWeeklyUniqueCounts(6);
    }

    /** 월별 고유 방문자 수 */
    @GetMapping("/monthly/unique")
    public List<VisitLogResponse> monthlyUnique() {
        return visitLogService.getMonthlyUniqueCounts(6);
    }

    /** 연별 고유 방문자 수 */
    @GetMapping("/yearly/unique")
    public List<VisitLogResponse> yearlyUnique() {
        return visitLogService.getYearlyUniqueCounts(5);
    }
}
