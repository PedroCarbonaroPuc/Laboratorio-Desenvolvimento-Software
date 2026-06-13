package br.com.labdevsoft.moeda.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "benefits")
public class Benefit {

    @Id
    private String id;

    private String partnerId;
    private String title;
    private String description;
    private String imageUrl;
    private long costCoins;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}
