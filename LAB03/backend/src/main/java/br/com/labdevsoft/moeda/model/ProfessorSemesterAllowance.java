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
@Document(collection = "professor_semester_allowances")
public class ProfessorSemesterAllowance {

    @Id
    private String id;

    private String professorId;
    private String semesterKey;

    @Indexed(unique = true)
    private String professorSemesterKey;

    private long allocatedAmount;
    private Instant createdAt;
}
