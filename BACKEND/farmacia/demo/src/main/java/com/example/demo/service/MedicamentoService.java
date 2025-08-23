package com.example.demo.service;


import com.example.demo.model.Medicamento;
import com.example.demo.repository.MedicamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicamentoService {

    private final MedicamentoRepository repository;

    public MedicamentoService(MedicamentoRepository repository) {
        this.repository = repository;

    }
    public List<Medicamento> findAll(){
        return repository.findAll();
    }

    public Optional<Medicamento> findById(Long id){
        return repository.findById(id);
    }

    public Medicamento save(Medicamento medicamento){
        return repository.save(medicamento);
    }

    public void deleteById(Long id){
        repository.deleteById(id);
    }






}
