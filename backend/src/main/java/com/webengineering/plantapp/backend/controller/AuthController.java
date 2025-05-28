// filepath: backend/src/main/java/com/webengineering/plantapp/backend/controller/AuthController.java
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

import java.util.Map;
import java.util.Optional;
import java.util.List;



@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GardenSpotRepository gardenSpotRepository;

    @Autowired
    private GardenSpotPlantRepository gardenSpotPlantRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body("E-Mail already exists");
        }
        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

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

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.emailExists(email);
        return ResponseEntity.ok(exists);
        }

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
    @GetMapping("/api/gardenspots")
    public List<GardenSpot> getUserGardenSpots(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return gardenSpotRepository.findByUserId(user.getId());
        } else {
            return List.of();
        }
    }
    @PostMapping("/api/gardenspots")
    public GardenSpot createGardenSpot(@RequestHeader("Authorization") String authHeader, @RequestBody GardenSpot spot) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            spot.setUser(userOpt.get());
            return gardenSpotRepository.save(spot);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
    }

    @DeleteMapping("/api/gardenspots/{gardenSpotId}")
    @Transactional
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

    // Ownership-Check
    if (!spot.getUser().getId().equals(userOpt.get().getId())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // erst alle Plants löschen
    gardenSpotPlantRepository.deleteAllByGardenSpotId(gardenSpotId);

    // dann den Spot
    gardenSpotRepository.deleteById(gardenSpotId);

    return ResponseEntity.noContent().build();
    }

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
        if (spotOpt.isEmpty() || !spotOpt.get().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // User darf nicht auf diesen Spot zugreifen
        }

        return ResponseEntity.ok(gardenSpotPlantRepository.findByGardenSpotId(gardenSpotId));
    }

    @PostMapping("/api/gardenspots/{gardenSpotId}/plants")
    public ResponseEntity<GardenSpotPlant> addPlantToGardenSpot(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gardenSpotId,
            @RequestBody PlantDataRequest plantData) {
        String email = jwtUtil.extractUsername(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<GardenSpot> spotOpt = gardenSpotRepository.findById(gardenSpotId);
        if (spotOpt.isEmpty() || !spotOpt.get().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        GardenSpotPlant newPlant = new GardenSpotPlant();
        newPlant.setExternalPlantId(plantData.getExternalPlantId());
        newPlant.setCommonName(plantData.getCommonName());
        newPlant.setThumbnail(plantData.getThumbnail());
        newPlant.setAmount(plantData.getAmount());
        newPlant.setGardenSpot(spotOpt.get());

        // Neue Felder setzen
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

        GardenSpotPlant savedPlant = gardenSpotPlantRepository.save(newPlant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlant);
    }

    @PutMapping("/api/gardenspotplants/{gardenSpotPlantId}")
    public ResponseEntity<GardenSpotPlant> updateGardenSpotPlant(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long gardenSpotPlantId,
            @RequestBody Map<String, Integer> payload) { // Erwartet {"amount": newAmount}
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
        // Sicherheitscheck: Gehört diese Pflanze zu einem GardenSpot des aktuellen Users?
        if (!plant.getGardenSpot().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Integer newAmount = payload.get("amount");
        if (newAmount == null || newAmount < 0) {
            return ResponseEntity.badRequest().body(null); // Oder spezifischere Fehlermeldung
        }
        plant.setAmount(newAmount);
        GardenSpotPlant updatedPlant = gardenSpotPlantRepository.save(plant);
        return ResponseEntity.ok(updatedPlant);
    }

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
        if (!plant.getGardenSpot().getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        gardenSpotPlantRepository.deleteById(gardenSpotPlantId);
        return ResponseEntity.noContent().build();
    }
}   

