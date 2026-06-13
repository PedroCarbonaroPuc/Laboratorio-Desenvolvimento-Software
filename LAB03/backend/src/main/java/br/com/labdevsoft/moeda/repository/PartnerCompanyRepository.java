package br.com.labdevsoft.moeda.repository;

import br.com.labdevsoft.moeda.model.PartnerCompany;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PartnerCompanyRepository extends MongoRepository<PartnerCompany, String> {

    Optional<PartnerCompany> findByEmailIgnoreCase(String email);

    Optional<PartnerCompany> findByCnpj(String cnpj);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByCnpj(String cnpj);
}
