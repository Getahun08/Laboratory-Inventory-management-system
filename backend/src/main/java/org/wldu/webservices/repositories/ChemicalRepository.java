package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.Chemical;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for {@link Chemical} entities.
 * Provides CRUD operations and custom query methods.
 */
@Repository
public interface ChemicalRepository extends JpaRepository<Chemical, Long> {

    /**
     * Find a chemical by its name.
     *
     * @param name chemical name
     * @return chemical entity
     */
    Chemical findByName(String name);

    /**
     * Find all chemicals that expire before the given date.
     *
     * @param date comparison date
     * @return list of expired chemicals
     */
    List<Chemical> findByExpiryDateBefore(LocalDate date);

    /**
     * Find all chemicals stored at a specific location.
     *
     * @param storageLocation storage location
     * @return list of chemicals
     */
    List<Chemical> findByStorageLocation(String storageLocation);

    /**
     * Find chemicals with quantity lower than the given threshold.
     * Useful for low-stock alerts.
     *
     * @param threshold quantity threshold
     * @return list of low-stock chemicals
     */
    List<Chemical> findByQuantityLessThan(int threshold);
}
