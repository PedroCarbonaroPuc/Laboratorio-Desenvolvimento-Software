package com.puc.moedaestudantil.dto.response;

import com.puc.moedaestudantil.model.Resgate;
import com.puc.moedaestudantil.model.enums.StatusResgate;

import java.time.LocalDateTime;

public record ResgateResponse(
        String id,
        String codigo,
        String alunoId,
        String alunoNome,
        String vantagemId,
        String vantagemNome,
        int custoMoedas,
        StatusResgate status,
        LocalDateTime data
) {
    public static ResgateResponse from(Resgate r) {
        return new ResgateResponse(
                r.getId(),
                r.getCodigo(),
                r.getAlunoId(),
                r.getAlunoNome(),
                r.getVantagemId(),
                r.getVantagemNome(),
                r.getCustoMoedas(),
                r.getStatus(),
                r.getData()
        );
    }
}
