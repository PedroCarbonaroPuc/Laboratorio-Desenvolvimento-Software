package com.puc.moedaestudantil.dto.response;

import com.puc.moedaestudantil.model.Aluno;

public record AlunoResponse(
        String id,
        String nome,
        String email,
        String cpf,
        String rg,
        String endereco,
        String curso,
        String instituicaoId,
        String instituicaoNome,
        int saldo,
        String login
) {
    public static AlunoResponse from(Aluno aluno, String instituicaoNome) {
        return new AlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getCpf(),
                aluno.getRg(),
                aluno.getEndereco(),
                aluno.getCurso(),
                aluno.getInstituicaoId(),
                instituicaoNome,
                aluno.getSaldo(),
                aluno.getLogin()
        );
    }
}
