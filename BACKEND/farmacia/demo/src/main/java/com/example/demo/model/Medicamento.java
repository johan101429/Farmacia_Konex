package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;


import java.sql.Date;

@Entity
@Table(name="medicamentos")
@Data

public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  long id;
    private String nombre;
    private String laboratorio;
    @Column(name="fecha_fabricacion")
    private Date fechaFabricacion;
    @Column(name="fecha_vencimiento")
    private Date fechaVencimiento;
    @Column(name = "cantidad_stock")
    private Integer cantidadStock;
    @Column(name="valor_unitario")
    private Double valorUnitario;


}
