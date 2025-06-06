package com.webengineering.plantapp.backend.controller;

import com.webengineering.plantapp.backend.model.User;
import com.webengineering.plantapp.backend.service.UserService;
import com.webengineering.plantapp.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.webengineering.plantapp.backend.model.GardenSpot;
import com.webengineering.plantapp.backend.model.GardenSpotPlant;
import com.webengineering.plantapp.backend.repository.GardenSpotPlantRepository;
import com.webengineering.plantapp.backend.repository.GardenSpotRepository;
import com.webengineering.plantapp.backend.dto.PlantDataRequest;
import com.webengineering.plantapp.backend.dto.GardenSpotPlantResponseDTO;

import java.util.Map;
import java.util.Optional;
import java.util.List;


/**
 * Controller für Authentifizierung und API-Endpunkte.
 * Definiert REST-Schnittstellen für Benutzerverwaltung, Garden Spots und Pflanzen.
 */
@RestController
@RequestMapping("/auth") // Alle Endpunkte in dieser Klasse beginnen mit /auth
public class AuthController {

    // Injiziert Abhängigkeiten für Service, JWT-Utility und Repositories
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GardenSpotRepository gardenSpotRepository;

    @Autowired
    private GardenSpotPlantRepository gardenSpotPlantRepository;

    /**
     * Endpunkt zur Registrierung eines neuen Benutzers.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("E-Mail already exists");
        }
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    /**
     * Endpunkt zum Einloggen eines Benutzers.
     * Gibt bei Erfolg einen JWT zurück.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        Optional<User> userOpt = userService.login(email, password);
        if (userOpt.isPresent()) {
            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(401).body("Login failed");
        }
    }

    /**
     * Endpunkt zur Überprüfung, ob eine E-Mail bereits existiert.
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.emailExists(email);
        return ResponseEntity.ok(exists);
        }

    /**
     * Endpunkt zum Abrufen der Daten des aktuell eingeloggten Benutzers.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);

        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "firstName", user.getFirstName(),
                "email", user.getEmail()
            ));
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    /**
     * Endpunkt zum Abrufen aller Garden Spots des aktuell eingeloggten Benutzers.
     */
    @GetMapping("/api/gardenspots")
    public List<GardenSpot> getUserGardenSpots(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return gardenSpotRepository.findByUserId(user.getId());
        } else {
            // Gibt eine leere Liste zurück, wenn der Benutzer nicht gefunden wird oder kein Token vorhanden ist.
            return List.of();
        }
    }

    /**
     * Endpunkt zum Erstellen eines neuen Garden Spots für den aktuell eingeloggten Benutzer.
     */
    @PostMapping("/api/gardenspots")
    public GardenSpot createGardenSpot(@RequestHeader("Authorization") String authHeader, @RequestBody GardenSpot spot) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            spot.setUser(userOpt.get()); // Setzt den Benutzer für den Garden Spot.
            return gardenSpotRepository.save(spot); // Speichert den neuen Garden Spot.
        } else {
            // Wirft eine Ausnahme, wenn der Benutzer nicht autorisiert ist.
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
    }

    /**
     * Endpunkt zum Löschen eines Garden Spots (und aller zugehörigen Pflanzen) des aktuell eingeloggten Benutzers.
     */
    @DeleteMapping("/api/gardenspots/{gardenSpotId}")
    @Transactional // Stellt sicher, dass alle DB-Operationen atomar sind.
    public ResponseEntity<Void> deleteGardenSpot(
    @RequestHeader("Authorization") String authHeader,
    @PathVariable Long gardenSpotId) {

    // Benutzer aus Token ermitteln
    String email = jwtUtil.extractUsername(authHeader.replace("Bearer ", ""));
    Optional<User> userOpt = userService.findByEmail(email);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // Spot laden
    Optional<GardenSpot> spotOpt = gardenSpotRepository.findById(gardenSpotId);
    if (spotOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    GardenSpot spot = spotOpt.get();

    // Ownership-Check: Stellt sicher, dass der Benutzer der Eigentümer des Spots ist.
    if (!spot.getUser().getId().equals(userOpt.get().getId())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Erst alle zugehörigen Pflanzen löschen.
    gardenSpotPlantRepository.deleteAllByGardenSpotId(gardenSpotId);

    // Dann den Garden Spot selbst löschen.
    gardenSpotRepository.deleteById(gardenSpotId);

    return ResponseEntity.noContent().build(); // HTTP 204 No Content als Erfolgsantwort.
    }

    /**
     * Endpunkt zum Abrufen aller Pflanzen eines spezifischen Garden Spots.
     * Stellt sicher, dass der Benutzer Zugriff auf den Garden Spot hat.
     */
    @GetMapping("/api/gardenspots/{gardenSpotId}/plants")
    public ResponseEntity<List<GardenSpotPlant>> getPlantsForGardenSpot(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gardenSpotId) {
        String email = jwtUtil.extractUsername(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<GardenSpot> spotOpt = gardenSpotRepository.findById(gardenSpotId);
        // Prüft, ob der Spot existiert und dem aktuellen Benutzer gehört.
        if (spotOpt.isEmpty() || !spotOpt.get().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(gardenSpotPlantRepository.findByGardenSpotId(gardenSpotId));
    }

    /**
     * Endpunkt zum Hinzufügen einer neuen Pflanze zu einem spezifischen Garden Spot.
     * Stellt sicher, dass der Benutzer Zugriff auf den Garden Spot hat.
     */
    @PostMapping("/api/gardenspots/{gardenSpotId}/plants")
    public ResponseEntity<GardenSpotPlant> addPlantToGardenSpot(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gardenSpotId,
            @RequestBody PlantDataRequest plantData) { // Nimmt Pflanzendaten als Request Body entgegen.
        String email = jwtUtil.extractUsername(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<GardenSpot> spotOpt = gardenSpotRepository.findById(gardenSpotId);
        // Prüft, ob der Spot existiert und dem aktuellen Benutzer gehört.
        if (spotOpt.isEmpty() || !spotOpt.get().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Erstellt eine neue GardenSpotPlant-Entität und befüllt sie mit den Daten.
        GardenSpotPlant newPlant = new GardenSpotPlant();
        newPlant.setExternalPlantId(plantData.getExternalPlantId());
        newPlant.setCommonName(plantData.getCommonName());
        newPlant.setThumbnail(plantData.getThumbnail());
        newPlant.setAmount(plantData.getAmount());
        newPlant.setGardenSpot(spotOpt.get());

        // Setzt die zusätzlichen Felder für die Pflanze.
        newPlant.setSunlight(plantData.getSunlight());
        newPlant.setWatering(plantData.getWatering());
        newPlant.setCareLevel(plantData.getCareLevel());
        newPlant.setPruningMonth(plantData.getPruningMonth());
        newPlant.setCycle(plantData.getCycle());
        newPlant.setGrowthRate(plantData.getGrowthRate());
        newPlant.setDroughtTolerant(plantData.isDroughtTolerant());
        newPlant.setIndoor(plantData.isIndoor());
        newPlant.setMedicinal(plantData.isMedicinal());
        newPlant.setDescription(plantData.getDescription());
        newPlant.setOrigin(plantData.getOrigin());

        GardenSpotPlant savedPlant = gardenSpotPlantRepository.save(newPlant); // Speichert die neue Pflanze.
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlant); // HTTP 201 Created als Erfolgsantwort.
    }

    /**
     * Endpunkt zum Aktualisieren der Daten einer Pflanze (z.B. Menge).
     * Stellt sicher, dass der Benutzer Zugriff auf die Pflanze hat.
     */
    @PutMapping("/api/gardenspotplants/{gardenSpotPlantId}")
    @Transactional // Stellt sicher, dass die DB-Operation atomar ist.
    public ResponseEntity<GardenSpotPlantResponseDTO> updateGardenSpotPlant(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gardenSpotPlantId,
            @RequestBody Map<String, Integer> payload) { // Erwartet eine Map mit dem Feld "amount".
        String email = jwtUtil.extractUsername(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<GardenSpotPlant> plantOpt = gardenSpotPlantRepository.findById(gardenSpotPlantId);
        if (plantOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        GardenSpotPlant plant = plantOpt.get();
        // Ownership-Check: Stellt sicher, dass die Pflanze zu einem Spot des Benutzers gehört.
        if (!plant.getGardenSpot().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Integer newAmount = payload.get("amount");
        if (newAmount == null || newAmount < 0) {
            return ResponseEntity.badRequest().body(null); // Ungültige Menge.
        }
        plant.setAmount(newAmount); // Aktualisiert die Menge der Pflanze.
        GardenSpotPlant updatedPlantEntity = gardenSpotPlantRepository.save(plant); // Speichert die Änderungen.

        // Konvertiert die Entität in ein DTO für die Antwort.
        GardenSpotPlantResponseDTO responseDto = new GardenSpotPlantResponseDTO(
            updatedPlantEntity.getId(),
            updatedPlantEntity.getExternalPlantId(),
            updatedPlantEntity.getCommonName(),
            updatedPlantEntity.getThumbnail(),
            updatedPlantEntity.getAmount(),
            updatedPlantEntity.getSunlight(),
            updatedPlantEntity.getWatering(),
            updatedPlantEntity.getCareLevel(),
            updatedPlantEntity.getPruningMonth(),
            updatedPlantEntity.getCycle(),
            updatedPlantEntity.getGrowthRate(),
            updatedPlantEntity.isDroughtTolerant(),
            updatedPlantEntity.isIndoor(),
            updatedPlantEntity.isMedicinal(),
            updatedPlantEntity.getDescription(),
            updatedPlantEntity.getOrigin()
        );
        return ResponseEntity.ok(responseDto); // Gibt das aktualisierte Pflanzen-DTO zurück.
    }

    /**
     * Endpunkt zum Löschen einer spezifischen Pflanze.
     * Stellt sicher, dass der Benutzer Zugriff auf die Pflanze hat.
     */
    @DeleteMapping("/api/gardenspotplants/{gardenSpotPlantId}")
    public ResponseEntity<Void> deleteGardenSpotPlant(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gardenSpotPlantId) {
        String email = jwtUtil.extractUsername(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<GardenSpotPlant> plantOpt = gardenSpotPlantRepository.findById(gardenSpotPlantId);
        if (plantOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        GardenSpotPlant plant = plantOpt.get();
        // Ownership-Check: Stellt sicher, dass die Pflanze zu einem Spot des Benutzers gehört.
        if (!plant.getGardenSpot().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        gardenSpotPlantRepository.deleteById(gardenSpotPlantId); // Löscht die Pflanze.
        return ResponseEntity.noContent().build(); // HTTP 204 No Content als Erfolgsantwort.
    }
}