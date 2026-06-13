package com.puc.moedaestudantil.dto.response;

import com.puc.moedaestudantil.model.Professor;

public record ProfessorResponse(
        String id,
        String nome,
        String email,
        String cpf,
        String departamento,
        String instituicaoId,
        String instituicaoNome,
        int saldo,
        String login
) {
    public static ProfessorResponse from(Professor professor, String instituicaoNome) {
        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getEmail(),
                professor.getCpf(),
                professor.getDepartamento(),
                professor.getInstituicaoId(),
                instituicaoNome,
                professor.getSaldo(),
                professor.getLogin()
        );
    }
}
