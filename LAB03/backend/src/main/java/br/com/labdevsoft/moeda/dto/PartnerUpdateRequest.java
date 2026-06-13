package br.com.labdevsoft.moeda.dto;

public record PartnerUpdateRequest(
        String companyName,
        String contactName,
        String address,
        String password) {
}
