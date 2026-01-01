package org.wldu.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.services.contracts.ChemicalService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController //here we mark a class as a RestFul  web controller
@RequestMapping("/api/chemicals")
public class ChemicalController {

    @Autowired //we enable dependency injection here
    private ChemicalService chemicalService;


    @PostMapping //we use this here to handle http post request
    public Chemical addChemical(@RequestBody Chemical chemical) {
        return chemicalService.saveChemical(chemical);
    }


    @GetMapping
    public List<Chemical> getAllChemicals() {
        return chemicalService.getAllChemicals();
    }


    @GetMapping("/{id}")
    public Optional<Chemical> getChemicalById(@PathVariable Long id) {
        return chemicalService.getChemicalById(id);
    }


    @GetMapping("/name/{name}")
    public Chemical getChemicalByName(@PathVariable String name) {
        return chemicalService.getChemicalByName(name);
    }


    @GetMapping("/expired")
    public List<Chemical> getExpiredChemicals() {
        return chemicalService.getExpiredChemicals(LocalDate.now());
    }


    @GetMapping("/location/{location}")
    public List<Chemical> getByStorageLocation(@PathVariable String location) {
        return chemicalService.getChemicalsByStorageLocation(location);
    }

    @PutMapping("/{id}")
    public Chemical updateChemical(@PathVariable Long id, @RequestBody Chemical chemical) {
        return chemicalService.updateChemical(id, chemical);
    }

    @GetMapping("/expiring-soon")
    public List<Chemical> getExpiringSoon() {
        LocalDate now = LocalDate.now();
        LocalDate future = now.plusDays(10);
        return chemicalService.getExpiringSoon(now, future);
    }



    @DeleteMapping("/{id}")
    public void deleteChemical(@PathVariable Long id) {
        chemicalService.deleteChemical(id);
    }
}
