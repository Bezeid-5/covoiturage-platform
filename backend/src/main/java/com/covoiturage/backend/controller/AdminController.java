package com.covoiturage.backend.controller;

import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.enums.Role;
import com.covoiturage.backend.repository.TrajetRepository;
import com.covoiturage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4100")
public class AdminController {
    
    private final UserRepository userRepository;
    private final TrajetRepository trajetRepository;
    private final com.covoiturage.backend.repository.ReservationRepository reservationRepository;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<String> suspendUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // You can add a 'suspended' field to User entity later
        // For now, we'll just return a success message
        return ResponseEntity.ok("User suspended successfully");
    }
    
    @DeleteMapping("/trajets/{id}")
    public ResponseEntity<String> deleteTrajet(@PathVariable Long id) {
        trajetRepository.deleteById(id);
        return ResponseEntity.ok("Trajet deleted successfully");
    }
    
    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> changeUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String roleStr = request.get("role");
        Role newRole = Role.valueOf(roleStr);
        user.setRole(newRole);
        
        User updated = userRepository.save(user);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepository.count();
        long totalTrajets = trajetRepository.count();
        long totalReservations = reservationRepository.count();
        
        System.out.println("📊 Total Users: " + totalUsers);
        System.out.println("📊 Total Trajets: " + totalTrajets);
        System.out.println("📊 Total Reservations: " + totalReservations);
        
        // Users by role
        long passengers = userRepository.countByRole(Role.PASSENGER);
        long drivers = userRepository.countByRole(Role.DRIVER);
        long admins = userRepository.countByRole(Role.ADMIN);
        
        System.out.println("📊 Passengers: " + passengers);
        System.out.println("📊 Drivers: " + drivers);
        System.out.println("📊 Admins: " + admins);
        
        Map<String, Long> usersByRole = Map.of(
            "PASSENGER", passengers,
            "DRIVER", drivers,
            "ADMIN", admins
        );
        
        System.out.println("📊 Final usersByRole map: " + usersByRole);
        
        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalTrajets", totalTrajets,
            "totalReservations", totalReservations,
            "usersByRole", usersByRole
        ));
    }
}
