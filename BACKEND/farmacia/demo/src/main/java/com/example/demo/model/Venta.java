package com.example.demo.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name =" VENTAS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Column(name = "fecha_hora", nullable = false, updatable = false, insertable = false)
    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn (name = "medicamento_id",nullable = false)
    private Medicamento medicamento;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "valor_unitario",nullable = false)
    private Double valorUnitario;

    @Column(name = "valor_total",nullable = false)
    private Double valorTotal;






}

