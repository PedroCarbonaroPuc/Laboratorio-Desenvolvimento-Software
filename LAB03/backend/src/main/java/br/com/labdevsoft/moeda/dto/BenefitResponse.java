package br.com.labdevsoft.moeda.dto;

public record BenefitResponse(
        String id,
        String partnerId,
        String partnerName,
        String title,
        String description,
        String imageUrl,
        long costCoins,
        boolean active) {
}
