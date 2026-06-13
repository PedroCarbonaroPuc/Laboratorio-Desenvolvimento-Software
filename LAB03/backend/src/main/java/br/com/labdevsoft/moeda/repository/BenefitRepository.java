package br.com.labdevsoft.moeda.repository;

import br.com.labdevsoft.moeda.model.Benefit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BenefitRepository extends MongoRepository<Benefit, String> {

    List<Benefit> findByActiveTrueOrderByCreatedAtDesc();

    List<Benefit> findByPartnerIdOrderByCreatedAtDesc(String partnerId);

    Optional<Benefit> findByPartnerIdAndTitleIgnoreCase(String partnerId, String title);

    long countByPartnerId(String partnerId);
}
