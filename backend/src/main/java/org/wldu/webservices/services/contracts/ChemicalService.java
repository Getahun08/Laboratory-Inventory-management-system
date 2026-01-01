package org.wldu.webservices.services.contracts;

import org.wldu.webservices.enities.Chemical;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
// here we define a contract for chemical related business logic
public interface ChemicalService {

    Chemical saveChemical(Chemical chemical);

    List<Chemical> getAllChemicals();

    Optional<Chemical> getChemicalById(Long id);

    Chemical getChemicalByName(String name);

    List<Chemical> getExpiredChemicals(LocalDate date);

    List<Chemical> getChemicalsByStorageLocation(String location);

    void deleteChemical(Long id);

    Chemical updateChemical(Long id, Chemical chemical);

    long countAll();

    long countLowStock(int threshold);

    List<Chemical> findLowStock(int threshold);
    List<Chemical> getExpiringSoon(LocalDate now, LocalDate future);

}
