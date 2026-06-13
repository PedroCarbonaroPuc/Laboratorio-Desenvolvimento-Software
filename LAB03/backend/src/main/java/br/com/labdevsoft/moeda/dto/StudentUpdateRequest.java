package br.com.labdevsoft.moeda.dto;

public record StudentUpdateRequest(
        String name,
        String address,
        String course,
        String password) {
}
