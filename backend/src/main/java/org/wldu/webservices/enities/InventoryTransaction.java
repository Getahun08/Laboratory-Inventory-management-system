package org.wldu.webservices.enities;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipment_id", nullable = false)
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chemical_id", nullable = false)
   @JsonIdentityReference(alwaysAsId = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Chemical chemical;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
   @JsonIdentityReference(alwaysAsId = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Supplier supplier;

    @Column(nullable = false)
    private double quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType; // IN / OUT / ADJUSTMENT

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime timestamp;

    @Column
    private String notes;

    // =====================
    // Constructors
    // =====================
    public InventoryTransaction() {}

    public InventoryTransaction(Equipment equipment,
                                Chemical chemical,
                                Supplier supplier,
                                double quantity,
                                TransactionType transactionType,
                                LocalDate transactionDate,
                                String notes) {
        this.equipment = equipment;
        this.chemical = chemical;
        this.supplier = supplier;
        this.quantity = quantity;
        this.transactionType = transactionType;
        this.transactionDate = transactionDate;
        this.notes = notes;
    }

    // =====================
    // Explicit getters & setters (avoid Lombok issues)
    // =====================
    public Long getId() { return id; }

    public Equipment getEquipment() { return equipment; }
    public void setEquipment(Equipment equipment) { this.equipment = equipment; }

    public Chemical getChemical() { return chemical; }
    public void setChemical(Chemical chemical) { this.chemical = chemical; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public LocalDateTime getTimestamp() { return timestamp; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // =====================
    // JSON setters for ID mapping
    // =====================
    @JsonSetter("equipmentId")
    public void setEquipmentById(Long id) {
        if (id != null) {
            Equipment e = new Equipment();
            e.setId(id);
            this.equipment = e;
        }
    }

    @JsonSetter("chemicalId")
    public void setChemicalById(Long id) {
        if (id != null) {
            Chemical c = new Chemical();
            c.setId(id);
            this.chemical = c;
        }
    }

    @JsonSetter("supplierId")
    public void setSupplierById(Long id) {
        if (id != null) {
            Supplier s = new Supplier();
            s.setId(id);
            this.supplier = s;
        }
    }

    @JsonSetter("transaction_type")
    public void setTransactionTypeByString(String type) {
        if (type != null && !type.isEmpty()) {
            this.transactionType = TransactionType.valueOf(type.toUpperCase());
        }
    }

    @JsonSetter("transactionDate")
    public void setTransactionDateFromString(String date) {
        if (date != null && !date.isEmpty()) {
            this.transactionDate = LocalDate.parse(date.substring(0, 10));
        }
    }

    // =====================
    // Auto-set defaults before persisting
    // =====================
    @PrePersist
    public void prePersist() {
        if (transactionDate == null) transactionDate = LocalDate.now();
        if (transactionType == null) transactionType = TransactionType.IN;
    }
}
