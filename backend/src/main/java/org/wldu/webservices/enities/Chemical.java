package org.wldu.webservices.enities;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity representing a chemical stored in the laboratory inventory.
 * This class maps to the "chemicals" table in the database.
 */
@Entity
@Table(name = "chemicals")
public class Chemical {

    /**
     * Primary key identifier for the chemical.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Common name of the chemical.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Chemical formula (e.g., H2O, NaCl).
     */
    @Column(nullable = false)
    private String chemicalFormula;

    /**
     * Quantity of the chemical.
     */
    @Column(nullable = false)
    private double quantity;

    /**
     * Unit of measurement (ML, L, etc.).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Unit unit;

    /**
     * Expiry date of the chemical.
     */
    @Column(nullable = false)
    private LocalDate expiryDate;

    /**
     * Storage location within the laboratory.
     */
    @Column(nullable = false)
    private String storageLocation;

    // Default constructor required by JPA
    public Chemical() {}

    public Chemical(
            String name,
            String chemicalFormula,
            double quantity,
            Unit unit,
            LocalDate expiryDate,
            String storageLocation
    ) {
        this.name = name;
        this.chemicalFormula = chemicalFormula;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.storageLocation = storageLocation;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getChemicalFormula() {
        return chemicalFormula;
    }

    public void setChemicalFormula(String chemicalFormula) {
        this.chemicalFormula = chemicalFormula;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public Unit getUnit() {
        return unit;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    /**
     * Useful for logging and debugging.
     * Does NOT affect persistence or functionality.
     */
    @Override
    public String toString() {
        return "Chemical{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", chemicalFormula='" + chemicalFormula + '\'' +
                ", quantity=" + quantity +
                ", unit=" + unit +
                ", expiryDate=" + expiryDate +
                ", storageLocation='" + storageLocation + '\'' +
                '}';
    }
}
