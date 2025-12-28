package org.wldu.webservices.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.enities.InventoryTransaction;
import org.wldu.webservices.repositories.InventoryTransactionRepository;
import org.wldu.webservices.services.contracts.ChemicalService;
import org.wldu.webservices.services.contracts.EquipmentService;
import org.wldu.webservices.services.contracts.SupplierService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ChemicalService chemicalService;
    private final EquipmentService equipmentService;
    private final SupplierService supplierService;
    private final InventoryTransactionRepository transactionRepository;

    private static final int LOW_STOCK_THRESHOLD = 10; // default threshold

    public DashboardController(ChemicalService chemicalService,
                               EquipmentService equipmentService,
                               SupplierService supplierService,
                               InventoryTransactionRepository transactionRepository) {
        this.chemicalService = chemicalService;
        this.equipmentService = equipmentService;
        this.supplierService = supplierService;
        this.transactionRepository = transactionRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        long totalChemicals  = safe(chemicalService.countAll());
        long equipmentItems  = safe(equipmentService.countAll());
        long lowStockAlerts  = safe(chemicalService.countLowStock(LOW_STOCK_THRESHOLD));
        long activeSuppliers = safe(supplierService.countActiveSuppliers());

        return Map.of(
                "totalChemicals", totalChemicals,
                "equipmentItems", equipmentItems,
                "lowStockAlerts", lowStockAlerts,
                "activeSuppliers", activeSuppliers
        );
    }

    /**
     * Safely convert Object -> long
     * Handles null, Long, Integer, BigInteger, etc.
     */
    private long safe(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }

    @GetMapping("/transactions/recent")
    public List<InventoryTransaction> getRecentTransactions() {
        return transactionRepository.findTop5ByOrderByTransactionDateDesc();
    }

    @GetMapping("/stock/low")
    public List<Chemical> getLowStock() {
        return chemicalService.findLowStock(LOW_STOCK_THRESHOLD);
    }
}
