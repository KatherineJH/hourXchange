package com.example.oauthjwt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.oauthjwt.service.TimeSeriesServiece;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/forecast")
public class TimeSeriesController {

    private final TimeSeriesServiece timeSeriesServiece;

    @PostMapping
    public ResponseEntity<?> predict(@RequestBody Map<String, Object> body) {
        List<Map<String, Object>> history = (List<Map<String, Object>>) body.get("history");
        Integer periods = (Integer) body.getOrDefault("periods", 7); // default to 7
        List<Map<String, Object>> forecast = timeSeriesServiece.getForecast(history, periods);
        return ResponseEntity.ok(forecast);
    }

    @PostMapping("/donation")
    public ResponseEntity<?> donationML(@RequestBody Map<String, Object> features) {
        Map<String, Object> result = timeSeriesServiece.predictDonation(features);
        return ResponseEntity.ok(result);
    }
}
