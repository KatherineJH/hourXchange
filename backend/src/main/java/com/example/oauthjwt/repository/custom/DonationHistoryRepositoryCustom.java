package com.example.oauthjwt.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.DonationHistorySearchCondition;
import com.example.oauthjwt.entity.DonationHistory;

public interface DonationHistoryRepositoryCustom {
    Page<DonationHistory> search(DonationHistorySearchCondition condition, Pageable pageable);
}
