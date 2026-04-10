package com.rentacar.exception;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Error;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@Secured(SecurityRule.IS_ANONYMOUS)
public class GlobalExceptionHandler {

    @Error(global = true, exception = ResourceNotFoundException.class)
    public HttpResponse<Map<String, Object>> handleResourceNotFound(HttpRequest<?> request, ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @Error(global = true, exception = BusinessException.class)
    public HttpResponse<Map<String, Object>> handleBusinessException(HttpRequest<?> request, BusinessException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @Error(global = true, exception = UnauthorizedException.class)
    public HttpResponse<Map<String, Object>> handleUnauthorized(HttpRequest<?> request, UnauthorizedException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @Error(global = true, exception = ConstraintViolationException.class)
    public HttpResponse<Map<String, Object>> handleValidation(HttpRequest<?> request, ConstraintViolationException ex) {
        Map<String, String> fieldErrors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        v -> {
                            String path = v.getPropertyPath().toString();
                            int dotIndex = path.lastIndexOf('.');
                            return dotIndex >= 0 ? path.substring(dotIndex + 1) : path;
                        },
                        ConstraintViolation::getMessage,
                        (a, b) -> a
                ));

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.getCode());
        body.put("error", "Erro de validação");
        body.put("fieldErrors", fieldErrors);
        return HttpResponse.badRequest().body(body);
    }

    @Error(global = true, exception = Exception.class)
    public HttpResponse<Map<String, Object>> handleGeneral(HttpRequest<?> request, Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor");
    }

    private HttpResponse<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.getCode());
        body.put("error", message);
        return HttpResponse.status(status).body(body);
    }
}
