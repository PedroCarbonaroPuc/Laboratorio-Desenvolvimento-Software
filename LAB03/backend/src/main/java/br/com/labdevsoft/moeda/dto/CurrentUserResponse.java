package br.com.labdevsoft.moeda.dto;

import br.com.labdevsoft.moeda.model.enums.Role;

public record CurrentUserResponse(
        Role role,
        String userId,
        String displayName,
        String email,
        long balance) {
}
