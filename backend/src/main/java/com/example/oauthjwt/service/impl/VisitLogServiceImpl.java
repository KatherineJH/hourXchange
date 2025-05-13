package com.example.oauthjwt.service.impl;

import com.example.oauthjwt.dto.response.VisitLogResponse;
import com.example.oauthjwt.repository.VisitLogRepository;
import com.example.oauthjwt.service.VisitLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitLogServiceImpl implements VisitLogService {
    private final VisitLogRepository visitLogRepository;

    private static final ZoneId SEOUL = ZoneId.of("Asia/Seoul");

    @Override
    public List<VisitLogResponse> getDailyCounts(int daysBack) {
        LocalDate todaySeoul = LocalDate.now(SEOUL);
        LocalDate fromDate    = todaySeoul.minusDays(daysBack);
        LocalDateTime from    = fromDate.atStartOfDay();
        return visitLogRepository.countByDay(from);
    }

    @Override
    public List<VisitLogResponse> getWeeklyCounts(int weeksBack) {
        LocalDate todaySeoul = LocalDate.now(SEOUL);
        LocalDate fromDate   = todaySeoul.minusWeeks(weeksBack);
        LocalDateTime from   = fromDate.atStartOfDay();
        return visitLogRepository.countByWeek(from);
    }

    @Override
    public List<VisitLogResponse> getMonthlyCounts(int monthsBack) {
        LocalDate todaySeoul    = LocalDate.now(SEOUL);
        LocalDate firstOfMonth  = todaySeoul.minusMonths(monthsBack)
                .withDayOfMonth(1);
        LocalDateTime from      = firstOfMonth.atStartOfDay();
        return visitLogRepository.countByMonth(from);
    }

    @Override
    public List<VisitLogResponse> getYearlyCounts(int yearsBack) {
        LocalDate todaySeoul    = LocalDate.now(SEOUL);
        // yearsBack년 전 1월 1일로 설정
        LocalDate firstOfYear   = todaySeoul.minusYears(yearsBack)
                .withDayOfYear(1);
        LocalDateTime from      = firstOfYear.atStartOfDay();
        return visitLogRepository.countByYear(from);
    }
}
