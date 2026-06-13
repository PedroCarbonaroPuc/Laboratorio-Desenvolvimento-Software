package br.com.labdevsoft.moeda.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CoinTransferRequest(
        @NotBlank(message = "Aluno e obrigatorio")
        String studentId,

        @NotNull(message = "Quantidade de moedas e obrigatoria")
        @Min(value = 1, message = "Quantidade deve ser maior que zero")
        Long amount,

        @NotBlank(message = "Mensagem de reconhecimento e obrigatoria")
        String message) {
}
