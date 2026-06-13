package br.com.labdevsoft.moeda.exception;

public class ForbiddenOperationException extends BusinessException {

    public ForbiddenOperationException(String message) {
        super(message);
    }
}
