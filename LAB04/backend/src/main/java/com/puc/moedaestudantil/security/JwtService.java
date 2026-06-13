package com.puc.moedaestudantil.security;

import com.puc.moedaestudantil.model.enums.TipoUsuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(io.jsonwebtoken.io.Decoders.BASE64.decode(secret));
    }

    public String gerarToken(String userId, String login, String nome, TipoUsuario tipo) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("login", login);
        claims.put("nome", nome);
        claims.put("tipo", tipo.name());

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key())
                .compact();
    }

    public Claims extrairClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extrairUserId(String token) {
        return extrairClaims(token).getSubject();
    }

    public TipoUsuario extrairTipo(String token) {
        return TipoUsuario.valueOf((String) extrairClaims(token).get("tipo"));
    }

    public boolean tokenValido(String token) {
        try {
            return extrairClaims(token).getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }
}
