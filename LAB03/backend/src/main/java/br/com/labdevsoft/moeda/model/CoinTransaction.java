package br.com.labdevsoft.moeda.model;

import br.com.labdevsoft.moeda.model.enums.TransactionActorType;
import br.com.labdevsoft.moeda.model.enums.TransactionType;
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
@Document(collection = "coin_transactions")
public class CoinTransaction {

    @Id
    private String id;

    private TransactionType type;
    private long amount;
    private String description;

    private TransactionActorType fromActorType;
    private String fromActorId;
    private TransactionActorType toActorType;
    private String toActorId;

    private String professorId;
    private String studentId;
    private String partnerId;
    private String benefitId;
    private String couponCode;
    private String semesterKey;

    private Instant createdAt;
}
