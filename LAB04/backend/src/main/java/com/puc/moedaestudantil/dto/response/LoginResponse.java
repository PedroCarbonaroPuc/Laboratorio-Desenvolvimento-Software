package com.puc.moedaestudantil.dto.response;

import com.puc.moedaestudantil.model.enums.TipoUsuario;

public record LoginResponse(
        String token,
        String id,
        String nome,
        String login,
        TipoUsuario tipo,
        Integer saldo
) {
}
