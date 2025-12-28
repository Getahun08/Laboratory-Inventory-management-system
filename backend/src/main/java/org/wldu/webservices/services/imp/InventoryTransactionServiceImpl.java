package org.wldu.webservices.services.imp;

import org.springframework.stereotype.Service;
import org.wldu.webservices.enities.*;
import org.wldu.webservices.repositories.*;
import org.wldu.webservices.services.contracts.InventoryTransactionService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;
    private final EquipmentRepository equipmentRepository;
    private final ChemicalRepository chemicalRepository;
    private final SupplierRepository supplierRepository;

    public InventoryTransactionServiceImpl(
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

    @Override
    public InventoryTransaction saveTransaction(InventoryTransaction transaction) {

        // Validate and load Equipment
        Optional.ofNullable(transaction.getEquipment())
                .map(Equipment::getId)
                .ifPresent(id -> transaction.setEquipment(
                        equipmentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id))
                ));

        // Validate and load Chemical
        Optional.ofNullable(transaction.getChemical())
                .map(Chemical::getId)
                .ifPresent(id -> transaction.setChemical(
                        chemicalRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Chemical not found with id: " + id))
                ));

        // Validate and load Supplier
        Optional.ofNullable(transaction.getSupplier())
                .map(Supplier::getId)
                .ifPresent(id -> transaction.setSupplier(
                        supplierRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id))
                ));

        return transactionRepository.save(transaction);
    }

    @Override
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<InventoryTransaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByEquipment(Long equipmentId) {
        return transactionRepository.findByEquipment_Id(equipmentId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByChemical(Long chemicalId) {
        return transactionRepository.findByChemical_Id(chemicalId);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByType(String transactionTypeStr) {
        TransactionType type = TransactionType.valueOf(transactionTypeStr.toUpperCase());
        return transactionRepository.findByTransactionType(type);
    }

    @Override
    public List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        LocalDate startDate = startDateTime.toLocalDate();
        LocalDate endDate = endDateTime.toLocalDate();
        return transactionRepository.findByTransactionDateBetween(startDate, endDate);
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
