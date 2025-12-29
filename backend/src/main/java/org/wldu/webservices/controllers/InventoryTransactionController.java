package org.wldu.webservices.controllers;

import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.enities.Supplier;
import org.wldu.webservices.enities.TransactionType;
import org.wldu.webservices.repositories.InventoryTransactionRepository;
import org.wldu.webservices.repositories.EquipmentRepository;
import org.wldu.webservices.repositories.ChemicalRepository;
import org.wldu.webservices.repositories.SupplierRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000") // adjust frontend URL
public class InventoryTransactionController {

    private final InventoryTransactionRepository transactionRepository;
    private final EquipmentRepository equipmentRepository;
    private final ChemicalRepository chemicalRepository;
    private final SupplierRepository supplierRepository;

    public InventoryTransactionController(
            InventoryTransactionRepository transactionRepository,
            EquipmentRepository equipmentRepository,
            ChemicalRepository chemicalRepository,
            SupplierRepository supplierRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.equipmentRepository = equipmentRepository;
        this.chemicalRepository = chemicalRepository;
        this.supplierRepository = supplierRepository;
    }

    // ========================
    // CREATE TRANSACTION
    // ========================
    @PostMapping
    public InventoryTransaction save(@RequestBody Map<String, Object> payload) {
        Long equipmentId = Long.valueOf(payload.get("equipmentId").toString());
        Long chemicalId = Long.valueOf(payload.get("chemicalId").toString());
        Long supplierId = Long.valueOf(payload.get("supplierId").toString());
        Double quantity = Double.valueOf(payload.get("quantity").toString());
        String typeStr = payload.get("transactionType").toString();
        String dateStr = payload.get("transactionDate").toString();
        String notes = payload.getOrDefault("notes", "").toString();

        // Load full entities
        Equipment eq = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        Chemical chem = chemicalRepository.findById(chemicalId)
                .orElseThrow(() -> new RuntimeException("Chemical not found"));
        Supplier sup = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Convert string to enum
        TransactionType type = TransactionType.valueOf(typeStr.toUpperCase());

        // Build transaction
        InventoryTransaction tx = new InventoryTransaction();
        tx.setEquipment(eq);
        tx.setChemical(chem);
        tx.setSupplier(sup);
        tx.setQuantity(quantity);
        tx.setTransactionType(type);
        tx.setTransactionDate(LocalDate.parse(dateStr));
        tx.setNotes(notes);

        return transactionRepository.save(tx);
    }

    // ========================
    // GET ALL TRANSACTIONS
    // ========================
    @GetMapping
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // ========================
    // GET BY ID
    // ========================
    @GetMapping("/{id}")
    public Optional<InventoryTransaction> getTransactionById(@PathVariable Long id) {
        return transactionRepository.findById(id);
    }

    // ========================
    // GET BY EQUIPMENT
    // ========================
    @GetMapping("/equipment/{equipmentId}")
    public List<InventoryTransaction> getByEquipment(@PathVariable Long equipmentId) {
        return transactionRepository.findByEquipment_Id(equipmentId);
    }

    // ========================
    // GET BY CHEMICAL
    // ========================
    @GetMapping("/chemical/{chemicalId}")
    public List<InventoryTransaction> getByChemical(@PathVariable Long chemicalId) {
        return transactionRepository.findByChemical_Id(chemicalId);
    }

    // ========================
    // GET BY TRANSACTION TYPE
    // ========================
    @GetMapping("/type/{type}")
    public List<InventoryTransaction> getByType(@PathVariable String type) {
        TransactionType transactionType = TransactionType.valueOf(type.toUpperCase());
        return transactionRepository.findByTransactionType(transactionType);
    }

    // ========================
    // GET LATEST 5
    // ========================
    @GetMapping("/recent")
    public List<InventoryTransaction> getRecentTransactions() {
        return transactionRepository.findTop5ByOrderByTransactionDateDesc();
    }

    // ========================
    // DELETE
    // ========================
    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionRepository.deleteById(id);
    }
}
