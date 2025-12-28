package org.wldu.webservices.services.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.repositories.ChemicalRepository;
import org.wldu.webservices.services.contracts.ChemicalService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ChemicalServiceImpl implements ChemicalService {

    @Autowired
    private ChemicalRepository chemicalRepository;

    @Override
    public Chemical saveChemical(Chemical chemical) {
        return chemicalRepository.save(chemical);
    }

    @Override
    public List<Chemical> getAllChemicals() {
        return chemicalRepository.findAll();
    }

    @Override
    public Optional<Chemical> getChemicalById(Long id) {
        return chemicalRepository.findById(id);
    }

    @Override
    public Chemical getChemicalByName(String name) {
        return chemicalRepository.findByName(name);
    }

    @Override
    public List<Chemical> getExpiredChemicals(LocalDate date) {
        return chemicalRepository.findByExpiryDateBefore(date);
    }

    @Override
    public List<Chemical> getChemicalsByStorageLocation(String location) {
        return chemicalRepository.findByStorageLocation(location);
    }

    @Override
    public void deleteChemical(Long id) {
        chemicalRepository.deleteById(id);
    }

    @Override
    public Chemical updateChemical(Long id, Chemical chemical) {
        Chemical existing = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chemical not found"));

        existing.setName(chemical.getName());
        existing.setChemicalFormula(chemical.getChemicalFormula());
        existing.setQuantity(chemical.getQuantity());
        existing.setUnit(chemical.getUnit());
        existing.setExpiryDate(chemical.getExpiryDate());
        existing.setStorageLocation(chemical.getStorageLocation());

        return chemicalRepository.save(existing);
    }

    @Override
    public long countAll() {
        return chemicalRepository.count();
    }

    @Override
    public long countLowStock(int threshold) {
        return chemicalRepository.findByQuantityLessThan(threshold).size();
    }

    @Override
    public List<Chemical> findLowStock(int threshold) {
        return chemicalRepository.findByQuantityLessThan(threshold);
    }
}
