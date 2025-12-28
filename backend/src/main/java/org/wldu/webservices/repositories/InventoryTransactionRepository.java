package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.enities.TransactionType;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    // Get all transactions for a specific equipment
    List<InventoryTransaction> findByEquipment_Id(Long equipmentId);

    // Get all transactions for a specific chemical
    List<InventoryTransaction> findByChemical_Id(Long chemicalId);

    // Get the latest 5 transactions by transaction date
    List<InventoryTransaction> findTop5ByOrderByTransactionDateDesc();

    // Get all transactions between two dates
    List<InventoryTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);

    // Get all transactions by type (enum)
    List<InventoryTransaction> findByTransactionType(TransactionType transactionType);
}
