package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.EquipmentStatus;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Equipment findByName(String name);

    List<Equipment> findByStatus(EquipmentStatus status);

//    List<Equipment> findBySupplierId(Long supplierId);
}
