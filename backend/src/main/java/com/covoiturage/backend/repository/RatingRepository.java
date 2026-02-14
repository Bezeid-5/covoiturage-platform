package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.Rating;
import com.covoiturage.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByDriver(User driver);
    
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.driver = :driver")
    Double getAverageRatingForDriver(@Param("driver") User driver);
    
    Long countByDriver(User driver);
}
