package br.com.labdevsoft.moeda.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PartnerRegistrationRequest(
        @NotBlank(message = "Nome da empresa e obrigatorio")
        String companyName,

        @NotBlank(message = "Nome do contato e obrigatorio")
        String contactName,

        @Email(message = "Email invalido")
        @NotBlank(message = "Email e obrigatorio")
        String email,

        @NotBlank(message = "CNPJ e obrigatorio")
        String cnpj,

        @NotBlank(message = "Endereco e obrigatorio")
        String address,

        @NotBlank(message = "Senha e obrigatoria")
        @Size(min = 6, message = "Senha deve ter no minimo 6 caracteres")
        String password) {
}
