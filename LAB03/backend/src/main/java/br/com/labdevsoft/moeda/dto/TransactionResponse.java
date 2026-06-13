package br.com.labdevsoft.moeda.dto;

import br.com.labdevsoft.moeda.model.enums.TransactionType;
import java.time.Instant;

public record TransactionResponse(
        String id,
        TransactionType type,
        long amount,
        String description,
        String counterpart,
        String couponCode,
        Instant createdAt) {
}
