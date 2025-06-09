package com.example.oauthjwt.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.oauthjwt.dto.response.VisitLogResponse;
import com.example.oauthjwt.repository.VisitLogRepository;
import com.example.oauthjwt.service.VisitLogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VisitLogServiceImpl implements VisitLogService {
    private final VisitLogRepository visitLogRepository;
    private static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");

    @Override
    public List<VisitLogResponse> getDailyCounts(int daysBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusDays(daysBack).atStartOfDay();
        return visitLogRepository.countByDay(from);
    }

    @Override
    public List<VisitLogResponse> getWeeklyCounts(int weeksBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusWeeks(weeksBack).atStartOfDay();
        return visitLogRepository.countByWeek(from);
    }

    @Override
    public List<VisitLogResponse> getMonthlyCounts(int monthsBack) {
        LocalDate firstOfMonth = LocalDate.now(SEOUL).minusMonths(monthsBack).withDayOfMonth(1);
        LocalDateTime from = firstOfMonth.atStartOfDay();
        return visitLogRepository.countByMonth(from);
    }

    @Override
    public List<VisitLogResponse> getYearlyCounts(int yearsBack) {
        LocalDate firstOfYear = LocalDate.now(SEOUL).minusYears(yearsBack).withDayOfYear(1);
        LocalDateTime from = firstOfYear.atStartOfDay();
        return visitLogRepository.countByYear(from);
    }

    // --- 고유 사용자 수(UV) 기준 메서드 추가 ---
    @Override
    public List<VisitLogResponse> getDailyUniqueCounts(int daysBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusDays(daysBack).atStartOfDay();
        return visitLogRepository.countUniqueUsersByDay(from);
    }

    @Override
    public List<VisitLogResponse> getWeeklyUniqueCounts(int weeksBack) {
        LocalDateTime from = LocalDate.now(SEOUL).minusWeeks(weeksBack).atStartOfDay();
        return visitLogRepository.countUniqueUsersByWeek(from);
    }

    @Override
    public List<VisitLogResponse> getMonthlyUniqueCounts(int monthsBack) {
        LocalDate firstOfMonth = LocalDate.now(SEOUL).minusMonths(monthsBack).withDayOfMonth(1);
        LocalDateTime from = firstOfMonth.atStartOfDay();
        return visitLogRepository.countUniqueUsersByMonth(from);
    }

    @Override
    public List<VisitLogResponse> getYearlyUniqueCounts(int yearsBack) {
        LocalDate firstOfYear = LocalDate.now(SEOUL).minusYears(yearsBack).withDayOfYear(1);
        LocalDateTime from = firstOfYear.atStartOfDay();
        return visitLogRepository.countUniqueUsersByYear(from);
    }

    private static final List<String> DAY_ORDER = List.of("Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
            "Saturday", "Sunday");

    @Override
    public List<VisitLogResponse> getWeekdayStats(Long userId) {
        List<Object[]> raw = visitLogRepository.countByWeekdayForUser(userId);
        return raw.stream().map(row -> new VisitLogResponse((String) row[0], ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
    }
}
