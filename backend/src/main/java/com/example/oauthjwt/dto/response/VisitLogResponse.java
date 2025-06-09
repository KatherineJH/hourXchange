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
    private String period;
    private Long count;
    private String weekday;

    public VisitLogResponse(Object periodObj, Long count) {
        this.period = periodObj == null ? null : periodObj.toString();
        this.count = count;
        this.weekday = this.period;
    }
}
