package br.com.labdevsoft.moeda.model;

import br.com.labdevsoft.moeda.model.enums.Role;
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
@Document(collection = "session_tokens")
public class SessionToken {

    @Id
    private String id;

    @Indexed(unique = true)
    private String token;

    private Role role;
    private String userId;
    private Instant expiresAt;
    private Instant createdAt;
}
