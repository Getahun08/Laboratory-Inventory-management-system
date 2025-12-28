package org.wldu.webservices.services.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wldu.webservices.enities.Equipment;
import org.wldu.webservices.enities.EquipmentStatus;
import org.wldu.webservices.repositories.EquipmentRepository;
import org.wldu.webservices.services.contracts.EquipmentService;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Override
    public Equipment saveEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    @Override
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    @Override
    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }

    @Override
    public Equipment getEquipmentByName(String name) {
        return equipmentRepository.findByName(name);
    }

    @Override
    public List<Equipment> getEquipmentByStatus(EquipmentStatus status) {
        return equipmentRepository.findByStatus(status);
    }

    @Override
    public Optional<Equipment> updateEquipment(Long id, Equipment equipmentDetails) {
        return equipmentRepository.findById(id)
                .map(equipment -> {
                    equipment.setName(equipmentDetails.getName());
                    equipment.setCategory(equipmentDetails.getCategory());
                    equipment.setSerialNumber(equipmentDetails.getSerialNumber());
                    equipment.setStatus(equipmentDetails.getStatus());
                    equipment.setQuantity(equipmentDetails.getQuantity());
//                    equipment.setSupplier(equipmentDetails.getSupplier());

                    return equipmentRepository.save(equipment);
                });
    }

    @Override
    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    @Override
    public long countAll() {
        return equipmentRepository.count();
    }
}
