package org.wldu.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.Chemical;
import org.wldu.webservices.services.contracts.ChemicalService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing chemicals in the inventory system.
 * Handles CRUD operations and query-based endpoints.
 */
@RestController
@RequestMapping("/api/chemicals")
public class ChemicalController {

    /**
     * Service layer for chemical operations.
     */
    @Autowired
    private ChemicalService chemicalService;

    // -------------------- CREATE --------------------

    /**
     * Add a new chemical to the inventory.
     *
     * @param chemical chemical entity from request body
     * @return saved chemical
     */
    @PostMapping
    public Chemical addChemical(@RequestBody Chemical chemical) {
        return chemicalService.saveChemical(chemical);
    }

    // -------------------- READ --------------------

    /**
     * Retrieve all chemicals.
     *
     * @return list of chemicals
     */
    @GetMapping
    public List<Chemical> getAllChemicals() {
        return chemicalService.getAllChemicals();
    }

    /**
     * Retrieve a chemical by its ID.
     *
     * @param id chemical ID
     * @return optional chemical
     */
    @GetMapping("/{id}")
    public Optional<Chemical> getChemicalById(@PathVariable Long id) {
        return chemicalService.getChemicalById(id);
    }

    /**
     * Retrieve a chemical by its name.
     *
     * @param name chemical name
     * @return chemical
     */
    @GetMapping("/name/{name}")
    public Chemical getChemicalByName(@PathVariable String name) {
        return chemicalService.getChemicalByName(name);
    }

    /**
     * Retrieve all expired chemicals.
     *
     * @return list of expired chemicals
     */
    @GetMapping("/expired")
    public List<Chemical> getExpiredChemicals() {
        return chemicalService.getExpiredChemicals(LocalDate.now());
    }

    /**
     * Retrieve chemicals by storage location.
     *
     * @param location storage location
     * @return list of chemicals
     */
    @GetMapping("/location/{location}")
    public List<Chemical> getByStorageLocation(@PathVariable String location) {
        return chemicalService.getChemicalsByStorageLocation(location);
    }

    // -------------------- UPDATE --------------------

    /**
     * Update an existing chemical.
     *
     * @param id chemical ID
     * @param chemical updated chemical data
     * @return updated chemical
     */
    @PutMapping("/{id}")
    public Chemical updateChemical(@PathVariable Long id, @RequestBody Chemical chemical) {
        return chemicalService.updateChemical(id, chemical);
    }

    // -------------------- DELETE --------------------

    /**
     * Delete a chemical by ID.
     *
     * @param id chemical ID
     */
    @DeleteMapping("/{id}")
    public void deleteChemical(@PathVariable Long id) {
        chemicalService.deleteChemical(id);
    }
}
