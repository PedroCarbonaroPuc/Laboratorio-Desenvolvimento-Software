package br.com.labdevsoft.moeda.dto;

import java.time.Instant;

public record RedemptionResponse(
        String couponCode,
        String benefitId,
        String benefitTitle,
        String partnerName,
        long costCoins,
        long currentBalance,
        Instant redeemedAt) {
}
