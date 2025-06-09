package com.example.oauthjwt.service;

import java.util.List;
import java.util.Map;

public interface TimeSeriesServiece {
    List<Map<String, Object>> getForecast(List<Map<String, Object>> history, int periods);

    Map<String, Object> predictDonation(Map<String, Object> features);
}
