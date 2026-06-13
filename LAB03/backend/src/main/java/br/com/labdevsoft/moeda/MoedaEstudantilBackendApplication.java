package br.com.labdevsoft.moeda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MoedaEstudantilBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoedaEstudantilBackendApplication.class, args);
	}

}
