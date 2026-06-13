package com.puc.moedaestudantil.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record VantagemRequest(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "A descrição é obrigatória")
        String descricao,

        @NotBlank(message = "A foto é obrigatória")
        String foto,

        @NotNull(message = "O custo em moedas é obrigatório")
        @Positive(message = "O custo deve ser maior que zero")
        Integer custoMoedas
) {
}
