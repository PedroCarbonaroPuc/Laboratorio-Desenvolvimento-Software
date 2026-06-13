package com.puc.moedaestudantil.model;

import com.puc.moedaestudantil.model.enums.StatusResgate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "resgates")
public class Resgate {

    @Id
    private String id;

    @Indexed(unique = true)
    private String codigo;

    private String alunoId;
    private String alunoNome;
    private String vantagemId;
    private String vantagemNome;
    private int custoMoedas;
    private String empresaId;
    private StatusResgate status;
    private LocalDateTime data;

    public Resgate() {
        this.data = LocalDateTime.now();
        this.status = StatusResgate.PENDENTE;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(String alunoId) {
        this.alunoId = alunoId;
    }

    public String getAlunoNome() {
        return alunoNome;
    }

    public void setAlunoNome(String alunoNome) {
        this.alunoNome = alunoNome;
    }

    public String getVantagemId() {
        return vantagemId;
    }

    public void setVantagemId(String vantagemId) {
        this.vantagemId = vantagemId;
    }

    public String getVantagemNome() {
        return vantagemNome;
    }

    public void setVantagemNome(String vantagemNome) {
        this.vantagemNome = vantagemNome;
    }

    public int getCustoMoedas() {
        return custoMoedas;
    }

    public void setCustoMoedas(int custoMoedas) {
        this.custoMoedas = custoMoedas;
    }

    public String getEmpresaId() {
        return empresaId;
    }

    public void setEmpresaId(String empresaId) {
        this.empresaId = empresaId;
    }

    public StatusResgate getStatus() {
        return status;
    }

    public void setStatus(StatusResgate status) {
        this.status = status;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }
}
