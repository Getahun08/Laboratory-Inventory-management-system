package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.Chemical;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ChemicalRepository extends JpaRepository<Chemical, Long> {

    Chemical findByName(String name);

    List<Chemical> findByExpiryDateBefore(LocalDate date);

    List<Chemical> findByStorageLocation(String storageLocation);

    List<Chemical> findByQuantityLessThan(int threshold); // Low stock
}
