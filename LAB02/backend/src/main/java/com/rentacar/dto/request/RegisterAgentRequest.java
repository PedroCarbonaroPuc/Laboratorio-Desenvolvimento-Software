package com.rentacar.dto.request;

import com.rentacar.model.Address;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterAgentRequest {

    @NotBlank(message = "Razão social é obrigatória")
    private String companyName;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail deve ser válido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String password;

    @NotBlank(message = "CNPJ é obrigatório")
    private String cnpj;

    @NotNull(message = "Endereço é obrigatório")
    private Address address;

    private String phone;
}
