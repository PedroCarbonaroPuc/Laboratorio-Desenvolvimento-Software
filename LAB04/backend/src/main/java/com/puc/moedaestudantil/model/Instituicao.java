package com.puc.moedaestudantil.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "instituicoes")
public class Instituicao {

    @Id
    private String id;
    private String nome;
    private String cidade;

    public Instituicao() {
    }

    public Instituicao(String nome, String cidade) {
        this.nome = nome;
        this.cidade = cidade;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
}
