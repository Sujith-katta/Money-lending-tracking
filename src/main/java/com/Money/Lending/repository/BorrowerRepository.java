package com.Money.Lending.repository;

// src/main/java/com/example/borrowed/repository/BorrowerRepository.java

import com.Money.Lending.model.Borrower;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowerRepository extends JpaRepository<Borrower, Long> {
    List<Borrower> findByNameContainingIgnoreCase(String name);
}

