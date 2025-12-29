package org.wldu.webservices.enities;

import jakarta.persistence.*;

import java.time.LocalDate;
//import java.util.function.Supplier;
import org.wldu.webservices.enities.Supplier;




    @Entity
    @Table(name = "equipment")
    public class Equipment {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String name;

        private String category;

        @Column(unique = true)
        private String serialNumber;

        @Enumerated(EnumType.STRING)
        private EquipmentStatus status;

        private LocalDate purchaseDate;

//        @ManyToOne
//        @JoinColumn(name = "supplier_id")
//        private Supplier supplier;

        @Column(nullable = false)
        private int quantity;

        private String description;



        public Equipment() {}

        public Equipment(String name, String category, String serialNumber,
                         EquipmentStatus status, int quantity) {
            this.name = name;
            this.category = category;
            this.serialNumber = serialNumber;
            this.status = status;
            this.quantity = quantity;
        }



        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getSerialNumber() {
            return serialNumber;
        }

        public void setSerialNumber(String serialNumber) {
            this.serialNumber = serialNumber;
        }

        public EquipmentStatus getStatus() {
            return status;
        }

        public void setStatus(EquipmentStatus status) {
            this.status = status;
        }

        public LocalDate getPurchaseDate() {
            return purchaseDate;
        }

        public void setPurchaseDate(LocalDate purchaseDate) {
            this.purchaseDate = purchaseDate;
        }

//        public Supplier getSupplier() {
//            return supplier;
//        }
//
//        public void setSupplier(Supplier supplier) {
//            this.supplier = supplier;
//        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }


        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setId(Long id) {
        }
    }

