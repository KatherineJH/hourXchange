package com.example.oauthjwt.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.oauthjwt.dto.condition.DonationSearchCondition;
import com.example.oauthjwt.entity.Donation;

public interface DonationRepositoryCustom {
    Page<Donation> search(DonationSearchCondition condition, Pageable pageable);
}
