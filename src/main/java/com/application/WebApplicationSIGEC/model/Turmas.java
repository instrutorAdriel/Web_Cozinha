package com.application.WebApplicationSIGEC.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

public class Turmas {



    @Entity
    @Table(name = "turmas")
    public class Turma {

        @Id
        private Integer idTurma;

        private String laboratorio;
        private String nome;
        private Character situacao;

        public Integer getIdTurma() {
            return idTurma;
        }

        public void setIdTurma(Integer idTurma) {
            this.idTurma = idTurma;
        }

        public String getLaboratorio() {
            return laboratorio;
        }

        public void setLaboratorio(String laboratorio) {
            this.laboratorio = laboratorio;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public Character getSituacao() {
            return situacao;
        }

        public void setSituacao(Character situacao) {
            this.situacao = situacao;
        }
    }


}
