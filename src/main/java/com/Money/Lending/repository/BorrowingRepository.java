package com.Money.Lending.repository;



import com.Money.Lending.model.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    List<Borrowing> findByBorrowerId(Long borrowerId);
}
