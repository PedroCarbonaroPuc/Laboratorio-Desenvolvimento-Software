package com.puc.moedaestudantil.dto.response;

import com.puc.moedaestudantil.model.EmpresaParceira;

public record EmpresaParceiraResponse(
        String id,
        String nome,
        String email,
        String cnpj,
        String login
) {
    public static EmpresaParceiraResponse from(EmpresaParceira empresa) {
        return new EmpresaParceiraResponse(
                empresa.getId(),
                empresa.getNome(),
                empresa.getEmail(),
                empresa.getCnpj(),
                empresa.getLogin()
        );
    }
}
