package br.com.labdevsoft.moeda.dto;

public record PartnerResponse(
        String id,
        String companyName,
        String contactName,
        String email,
        String cnpj,
        String address) {
}
