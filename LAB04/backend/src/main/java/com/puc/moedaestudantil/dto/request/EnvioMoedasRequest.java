package com.puc.moedaestudantil.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record EnvioMoedasRequest(
        @NotBlank(message = "O aluno destinatário é obrigatório")
        String alunoId,

        @NotNull(message = "A quantidade é obrigatória")
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer quantidade,

        @NotBlank(message = "A mensagem/motivo é obrigatória")
        String mensagem
) {
}
