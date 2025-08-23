package com.example.demo.service;

import com.example.demo.model.Medicamento;
import com.example.demo.model.Venta;
import com.example.demo.repository.MedicamentoRepository;
import com.example.demo.repository.VentasRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VentaService {

    private final VentasRepository ventasRepository;
    private final MedicamentoRepository medicamentoRepository;

    public VentaService(VentasRepository ventasRepository, MedicamentoRepository medicamentoRepository) {
        this.ventasRepository = ventasRepository;
        this.medicamentoRepository = medicamentoRepository;
    }

    @Transactional
    public Venta registrarVenta(Long medicamentoId, Integer cantidad) {
        Medicamento medicamento = medicamentoRepository.findById(medicamentoId)
                .orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

        if (medicamento.getCantidadStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente");
        }

        double valorUnitario = medicamento.getValorUnitario();
        double valorTotal = valorUnitario * cantidad;

        Venta venta = Venta.builder()
                .medicamento(medicamento)
                .cantidad(cantidad)
                .valorUnitario(valorUnitario)
                .valorTotal(valorTotal)
                .build();

        // Actualizar stock
        medicamento.setCantidadStock(medicamento.getCantidadStock() - cantidad);
        medicamentoRepository.save(medicamento);

        // Guardar venta
        return ventasRepository.save(venta);
    }

    public List<Venta> listarVentas() {
        return ventasRepository.findAll();
    }
}
