package com.Money.Lending.repository;


import com.Money.Lending.model.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepaymentRepository extends JpaRepository<Repayment, Long> {
    List<Repayment> findByBorrowingId(Long borrowingId);
}

