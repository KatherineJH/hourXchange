package com.example.oauthjwt.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitLogResponse {
    private String period;  // ex) "2025-05-13", "Week 20", "2025-05"
    private Long count;

    public VisitLogResponse(Object periodObj, Long count) {
        this.period = periodObj == null ? null : periodObj.toString();
        this.count  = count;
    }
}
