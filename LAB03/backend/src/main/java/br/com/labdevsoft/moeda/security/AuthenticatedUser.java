package br.com.labdevsoft.moeda.security;

import br.com.labdevsoft.moeda.model.enums.Role;

public record AuthenticatedUser(
        String userId,
        Role role,
        String token) {
}
