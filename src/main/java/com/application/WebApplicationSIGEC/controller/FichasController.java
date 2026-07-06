package com.application.WebApplicationSIGEC.controller;

import com.application.WebApplicationSIGEC.model.Fichas;
import com.application.WebApplicationSIGEC.service.FichasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/")
public class FichasController {

    @Autowired
    private FichasService fichasService;



    @GetMapping("/calendario")
    public String exibirCalendario(Model model){

       return "calendario";
    }

    public ResponseEntity<List<Fichas>> exibindoFichas(){
        List<Fichas> lista = fichasService.buscarTodas();
        return  ResponseEntity.ok(lista);
    }

}
