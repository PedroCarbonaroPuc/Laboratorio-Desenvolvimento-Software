package br.com.labdevsoft.moeda.repository;

import br.com.labdevsoft.moeda.model.Institution;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InstitutionRepository extends MongoRepository<Institution, String> {

    Optional<Institution> findByNameIgnoreCase(String name);
}
