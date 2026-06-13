package com.puc.moedaestudantil.dto.response;

import com.puc.moedaestudantil.model.Vantagem;

public record VantagemResponse(
        String id,
        String nome,
        String descricao,
        String foto,
        int custoMoedas,
        String empresaId,
        String empresaNome
) {
    public static VantagemResponse from(Vantagem vantagem, String empresaNome) {
        return new VantagemResponse(
                vantagem.getId(),
                vantagem.getNome(),
                vantagem.getDescricao(),
                vantagem.getFoto(),
                vantagem.getCustoMoedas(),
                vantagem.getEmpresaId(),
                empresaNome
        );
    }
}
