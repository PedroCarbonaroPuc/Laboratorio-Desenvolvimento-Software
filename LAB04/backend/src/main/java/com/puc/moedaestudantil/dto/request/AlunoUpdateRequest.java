package com.puc.moedaestudantil.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AlunoUpdateRequest(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "O CPF é obrigatório")
        String cpf,

        @NotBlank(message = "O RG é obrigatório")
        String rg,

        @NotBlank(message = "O endereço é obrigatório")
        String endereco,

        @NotBlank(message = "O curso é obrigatório")
        String curso,

        @NotBlank(message = "A instituição é obrigatória")
        String instituicaoId
) {
}
