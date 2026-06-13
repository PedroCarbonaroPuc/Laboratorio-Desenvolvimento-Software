package br.com.labdevsoft.moeda.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BenefitCreateRequest(
        @NotBlank(message = "Titulo e obrigatorio")
        String title,

        @NotBlank(message = "Descricao e obrigatoria")
        String description,

        @NotBlank(message = "Imagem do produto e obrigatoria")
        String imageUrl,

        @NotNull(message = "Custo em moedas e obrigatorio")
        @Min(value = 1, message = "Custo deve ser maior que zero")
        Long costCoins) {
}
