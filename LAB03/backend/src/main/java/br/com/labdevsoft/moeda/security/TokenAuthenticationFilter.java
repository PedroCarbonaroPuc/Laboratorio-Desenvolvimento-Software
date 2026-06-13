package br.com.labdevsoft.moeda.security;

import br.com.labdevsoft.moeda.model.SessionToken;
import br.com.labdevsoft.moeda.repository.SessionTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final SessionTokenRepository sessionTokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request);
        if (token != null) {
            sessionTokenRepository.findByToken(token)
                    .filter(this::isNotExpired)
                    .ifPresent(this::authenticate);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isNotExpired(SessionToken sessionToken) {
        return sessionToken.getExpiresAt() != null && sessionToken.getExpiresAt().isAfter(Instant.now());
    }

    private void authenticate(SessionToken sessionToken) {

        var user = new AuthenticatedUser(
                sessionToken.getUserId(),
                sessionToken.getRole(),
                sessionToken.getToken());

        var authentication = new UsernamePasswordAuthenticationToken(
                user,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + sessionToken.getRole().name())));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private String extractToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            return null;
        }
        return authorizationHeader.substring(BEARER_PREFIX.length()).trim();
    }
}
