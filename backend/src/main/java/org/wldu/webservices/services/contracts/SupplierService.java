package org.wldu.webservices.services.contracts;

import org.wldu.webservices.enities.Supplier;

import java.util.List;
import java.util.Optional;

public interface SupplierService {

    Supplier saveSupplier(Supplier supplier);

    List<Supplier> getAllSuppliers();

    Optional<Supplier> getSupplierById(Long id);

    Supplier getSupplierByName(String name);

    Supplier getSupplierByEmail(String email);

    List<Supplier> getSuppliersByContactPerson(String contactPerson);

    void deleteSupplier(Long id);

    Supplier update(Long id, Supplier supplier);

    long countActiveSuppliers();
}
