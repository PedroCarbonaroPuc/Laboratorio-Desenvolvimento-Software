package br.com.labdevsoft.moeda.dto;

public record BenefitUpdateRequest(
        String title,
        String description,
        String imageUrl,
        Long costCoins,
        Boolean active) {
}
