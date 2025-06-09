package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.response.VisitLogResponse;

import java.util.List;

public interface VisitLogService {
    List<VisitLogResponse> getDailyCounts(int daysBack);
    List<VisitLogResponse> getWeeklyCounts(int daysBack);
    List<VisitLogResponse> getMonthlyCounts(int daysBack);
    List<VisitLogResponse> getYearlyCounts(int yearsBack);

    List<VisitLogResponse> getDailyUniqueCounts(int daysBack);
    List<VisitLogResponse> getWeeklyUniqueCounts(int daysBack);
    List<VisitLogResponse> getMonthlyUniqueCounts(int daysBack);
    List<VisitLogResponse> getYearlyUniqueCounts(int yearsBack);
    List<VisitLogResponse> getWeekdayStats(Long userId);
}