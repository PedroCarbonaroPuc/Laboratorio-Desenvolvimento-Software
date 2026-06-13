package br.com.labdevsoft.moeda.dto;

import jakarta.validation.constraints.NotBlank;

public record RedeemBenefitRequest(
        @NotBlank(message = "Vantagem e obrigatoria")
        String benefitId) {
}
