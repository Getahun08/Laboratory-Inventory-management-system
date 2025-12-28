package org.wldu.webservices.services.contracts;

import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.EquipmentStatus;

import java.util.List;
import java.util.Optional;

public interface EquipmentService {

    Equipment saveEquipment(Equipment equipment);

    List<Equipment> getAllEquipment();

    Optional<Equipment> getEquipmentById(Long id);

    Equipment getEquipmentByName(String name);

    List<Equipment> getEquipmentByStatus(EquipmentStatus status);

//    List<Equipment> getEquipmentBySupplier(Long supplierId);

    Optional<Equipment> updateEquipment(Long id, Equipment equipmentDetails);

    void deleteEquipment(Long id);

    long countAll();
}
