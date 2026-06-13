package br.com.labdevsoft.moeda.security;

import br.com.labdevsoft.moeda.exception.ForbiddenOperationException;
import br.com.labdevsoft.moeda.exception.UnauthorizedException;
import br.com.labdevsoft.moeda.model.enums.Role;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthFacade {

    public AuthenticatedUser requireAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new UnauthorizedException("Autenticacao necessaria.");
        }
        return user;
    }

    public void requireRole(Role... roles) {
        AuthenticatedUser user = requireAuthenticatedUser();
        Set<Role> acceptedRoles = Arrays.stream(roles).collect(Collectors.toSet());
        if (!acceptedRoles.contains(user.role())) {
            throw new ForbiddenOperationException("Permissao insuficiente para esta operacao.");
        }
    }
}
