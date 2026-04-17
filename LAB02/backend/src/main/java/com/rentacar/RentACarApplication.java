package com.rentacar;

import io.micronaut.runtime.Micronaut;

import java.util.TimeZone;

public class RentACarApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
        Micronaut.run(RentACarApplication.class, args);
    }
}
