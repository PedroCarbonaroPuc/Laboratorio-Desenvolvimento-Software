package br.com.labdevsoft.moeda.repository;

import br.com.labdevsoft.moeda.model.SessionToken;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SessionTokenRepository extends MongoRepository<SessionToken, String> {

    Optional<SessionToken> findByToken(String token);

    void deleteByToken(String token);

    void deleteByExpiresAtBefore(Instant instant);
}
