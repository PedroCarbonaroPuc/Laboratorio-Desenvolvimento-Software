package br.com.labdevsoft.moeda.repository;

import br.com.labdevsoft.moeda.model.Professor;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfessorRepository extends MongoRepository<Professor, String> {

    Optional<Professor> findByEmailIgnoreCase(String email);

    Optional<Professor> findByCpf(String cpf);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByCpf(String cpf);
}
