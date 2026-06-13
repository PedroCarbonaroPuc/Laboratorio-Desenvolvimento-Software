package br.com.labdevsoft.moeda.repository;

import br.com.labdevsoft.moeda.model.CoinTransaction;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoinTransactionRepository extends MongoRepository<CoinTransaction, String> {

    List<CoinTransaction> findByProfessorIdOrderByCreatedAtDesc(String professorId);

    List<CoinTransaction> findByStudentIdOrderByCreatedAtDesc(String studentId);

    List<CoinTransaction> findByPartnerIdOrderByCreatedAtDesc(String partnerId);

    long countByProfessorId(String professorId);

    long countByStudentId(String studentId);

    long countByPartnerId(String partnerId);
}
