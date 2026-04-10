package com.rentacar.dto.request;

import io.micronaut.serde.annotation.Serdeable;

import com.rentacar.model.Address;
import com.rentacar.model.Employer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class RegisterClientRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail deve ser válido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String password;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "RG é obrigatório")
    private String rg;

    @NotNull(message = "Endereço é obrigatório")
    private Address address;

    @NotBlank(message = "Profissão é obrigatória")
    private String profession;

    @Size(max = 3, message = "Máximo de 3 empregadores permitidos")
    private List<Employer> employers;
}
