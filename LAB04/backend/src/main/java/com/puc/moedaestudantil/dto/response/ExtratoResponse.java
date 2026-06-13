package com.puc.moedaestudantil.dto.response;

import java.util.List;

public record ExtratoResponse(
        String usuarioId,
        String nome,
        int saldo,
        List<TransacaoResponse> transacoes
) {
}
