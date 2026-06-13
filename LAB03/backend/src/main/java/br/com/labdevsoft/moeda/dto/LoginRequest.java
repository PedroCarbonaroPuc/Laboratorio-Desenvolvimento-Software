package br.com.labdevsoft.moeda.dto;

import br.com.labdevsoft.moeda.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotBlank(message = "Login e obrigatorio")
        String login,

        @NotBlank(message = "Senha e obrigatoria")
        String password,

        @NotNull(message = "Perfil e obrigatorio")
        Role role) {
}
