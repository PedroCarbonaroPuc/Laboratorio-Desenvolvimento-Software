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
@Document(collection = "institutions")
public class Institution {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String campus;
    private String city;
    private Instant createdAt;
}
