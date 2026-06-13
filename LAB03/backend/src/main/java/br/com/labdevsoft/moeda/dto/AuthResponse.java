package br.com.labdevsoft.moeda.dto;

import br.com.labdevsoft.moeda.model.enums.Role;
import java.time.Instant;

public record AuthResponse(
        String token,
        Role role,
        String userId,
        String displayName,
        Instant expiresAt) {
}
