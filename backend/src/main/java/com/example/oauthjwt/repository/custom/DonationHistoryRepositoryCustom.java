package com.example.oauthjwt.repository.custom;

import com.example.oauthjwt.dto.condition.DonationHistorySearchCondition;
import com.example.oauthjwt.entity.DonationHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DonationHistoryRepositoryCustom {
    Page<DonationHistory> search(DonationHistorySearchCondition condition, Pageable pageable);
}
