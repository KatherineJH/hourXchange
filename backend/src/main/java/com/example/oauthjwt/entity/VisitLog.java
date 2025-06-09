package com.example.oauthjwt.entity;

import java.time.LocalDateTime;
import java.time.ZoneId;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime visitTime;

    @Column
    private Long userId;

    @Column(nullable = false, length = 45)
    private String ipAddress;

    @Column(length = 512)
    private String userAgent;

    @Column(nullable = false, length = 2048)
    private String url;

    @Column(length = 2048)
    private String referer;

    public static VisitLog of(Long userId, String ipAddress, String userAgent, String url, String referer) {
        return VisitLog.builder().visitTime(LocalDateTime.now(ZoneId.of("Asia/Seoul"))).userId(userId)
                .ipAddress(ipAddress).userAgent(userAgent).url(url).referer(referer).build();
    }
}
