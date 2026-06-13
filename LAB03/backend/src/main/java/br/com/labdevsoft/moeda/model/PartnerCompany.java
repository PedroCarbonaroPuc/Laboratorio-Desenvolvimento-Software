package br.com.labdevsoft.moeda.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "partners")
public class PartnerCompany {

    @Id
    private String id;

    private String companyName;
    private String contactName;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String cnpj;

    private String address;
    private String passwordHash;
    private Instant createdAt;
    private Instant updatedAt;
}
