package com.application.WebApplicationSIGEC;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class WebApplicationSIGEC {

    public static void main(String[] args) {
        // Carrega o arquivo ..env (se existir) para as propriedades de sistema do Java
        Dotenv dotenv = Dotenv.configure()
                .filename("..env")
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });

        System.out.println("Conexão MySQL carregada: " + System.getProperty("DB_URL"));

        SpringApplication.run(WebApplicationSIGEC.class, args);
    }
}