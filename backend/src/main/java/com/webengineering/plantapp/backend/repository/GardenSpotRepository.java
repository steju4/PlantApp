package com.webengineering.plantapp.backend.repository;

import com.webengineering.plantapp.backend.model.GardenSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Repository für CRUD-Operationen an GardenSpot
public interface GardenSpotRepository extends JpaRepository<GardenSpot, Long> {
    // Liefert alle GardenSpots zurück, die einem bestimmten Benutzer gehören
    List<GardenSpot> findByUserId(Long userId);
}