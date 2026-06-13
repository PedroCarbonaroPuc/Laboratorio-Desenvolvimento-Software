package com.puc.moedaestudantil.dto.response;

import com.puc.moedaestudantil.model.Transacao;
import com.puc.moedaestudantil.model.enums.TipoTransacao;

import java.time.LocalDateTime;

public record TransacaoResponse(
        String id,
        TipoTransacao tipo,
        String origemId,
        String origemNome,
        String destinoId,
        String destinoNome,
        int valor,
        String mensagem,
        LocalDateTime data
) {
    public static TransacaoResponse from(Transacao t) {
        return new TransacaoResponse(
                t.getId(),
                t.getTipo(),
                t.getOrigemId(),
                t.getOrigemNome(),
                t.getDestinoId(),
                t.getDestinoNome(),
                t.getValor(),
                t.getMensagem(),
                t.getData()
        );
    }
}
