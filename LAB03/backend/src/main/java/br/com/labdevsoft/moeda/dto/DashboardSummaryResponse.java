package br.com.labdevsoft.moeda.dto;

import br.com.labdevsoft.moeda.model.enums.Role;

public record DashboardSummaryResponse(
        Role role,
        String displayName,
        long balance,
        long totalTransactions,
        long totalBenefits) {
}
