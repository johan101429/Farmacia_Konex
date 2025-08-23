package com.example.demo.controller;


import com.example.demo.model.Venta;
import com.example.demo.service.VentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")

public class VentaController {
    private final VentaService ventaService;
    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;

    }
    @PostMapping
    public Venta registrarVenta(
            @RequestParam Long medicamentoId,
            @RequestParam Integer cantidad) {
        return ventaService.registrarVenta(medicamentoId, cantidad);
    }

    @GetMapping
    public List<Venta> listarVentas() {
        return ventaService.listarVentas();
    }
}
