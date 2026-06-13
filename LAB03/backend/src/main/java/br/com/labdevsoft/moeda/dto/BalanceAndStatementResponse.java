package br.com.labdevsoft.moeda.dto;

import java.util.List;

public record BalanceAndStatementResponse(
        long balance,
        List<TransactionResponse> transactions) {
}
