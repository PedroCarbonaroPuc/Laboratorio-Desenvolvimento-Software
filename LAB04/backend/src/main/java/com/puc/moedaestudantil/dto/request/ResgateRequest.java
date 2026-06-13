package com.puc.moedaestudantil.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record ResgateRequest(
        @NotBlank(message = "A vantagem é obrigatória")
        String vantagemId,

        @NotBlank(message = "O e-mail para envio do cupom é obrigatório")
        @Email(message = "Informe um e-mail válido para receber o cupom")
        String emailDestinoCupom
) {
}
