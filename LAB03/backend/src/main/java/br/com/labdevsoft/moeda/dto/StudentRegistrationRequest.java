package br.com.labdevsoft.moeda.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudentRegistrationRequest(
        @NotBlank(message = "Nome e obrigatorio")
        String name,

        @Email(message = "Email invalido")
        @NotBlank(message = "Email e obrigatorio")
        String email,

        @NotBlank(message = "CPF e obrigatorio")
        String cpf,

        @NotBlank(message = "RG e obrigatorio")
        String rg,

        @NotBlank(message = "Endereco e obrigatorio")
        String address,

        @NotBlank(message = "Instituicao e obrigatoria")
        String institutionId,

        @NotBlank(message = "Curso e obrigatorio")
        String course,

        @NotBlank(message = "Senha e obrigatoria")
        @Size(min = 6, message = "Senha deve ter no minimo 6 caracteres")
        String password) {
}
