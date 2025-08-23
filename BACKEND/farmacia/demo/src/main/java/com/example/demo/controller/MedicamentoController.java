package com.example.demo.controller;


import com.example.demo.model.Medicamento;
import com.example.demo.service.MedicamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicamentos")

public class MedicamentoController {

    private final MedicamentoService service;
    public MedicamentoController(MedicamentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Medicamento> getAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicamento> getById(@PathVariable Long id){
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medicamento create(@RequestBody Medicamento medicamento){
        return  service.save(medicamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicamento> update(@PathVariable Long id, @RequestBody Medicamento medicamento){
        return service.findById(id)
                .map(existing -> {
                    medicamento.setId(existing.getId());
                    return  ResponseEntity.ok(service.save(medicamento));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }




}
