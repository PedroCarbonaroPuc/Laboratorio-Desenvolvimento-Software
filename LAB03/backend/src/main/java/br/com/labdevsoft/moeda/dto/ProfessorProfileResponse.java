package br.com.labdevsoft.moeda.dto;

public record ProfessorProfileResponse(
        String id,
        String name,
        String email,
        String cpf,
        String department,
        String institutionId,
        long balance) {
}
