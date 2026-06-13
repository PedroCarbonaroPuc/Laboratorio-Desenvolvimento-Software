package br.com.labdevsoft.moeda.dto;

public record StudentResponse(
        String id,
        String name,
        String email,
        String cpf,
        String rg,
        String address,
        String institutionId,
        String course,
        long balance) {
}
