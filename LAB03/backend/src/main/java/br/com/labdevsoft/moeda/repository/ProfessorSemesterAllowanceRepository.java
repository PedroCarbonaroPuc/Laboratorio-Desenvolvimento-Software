package br.com.labdevsoft.moeda.repository;

import br.com.labdevsoft.moeda.model.ProfessorSemesterAllowance;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfessorSemesterAllowanceRepository extends MongoRepository<ProfessorSemesterAllowance, String> {

    Optional<ProfessorSemesterAllowance> findByProfessorSemesterKey(String professorSemesterKey);

    boolean existsByProfessorSemesterKey(String professorSemesterKey);
}
