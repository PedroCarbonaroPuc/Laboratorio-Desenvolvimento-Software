package com.puc.moedaestudantil.dto.request;

import com.puc.moedaestudantil.model.enums.TipoUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotBlank(message = "O login é obrigatório")
        String login,

        @NotBlank(message = "A senha é obrigatória")
        String senha,

        @NotNull(message = "O tipo de usuário é obrigatório")
        TipoUsuario tipo
) {
}
