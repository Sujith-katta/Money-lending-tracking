package com.Money.Lending.service;


import com.Money.Lending.model.Borrowing;
import com.Money.Lending.repository.BorrowingRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowingService {
    private final BorrowingRepository repo;
    private final InterestCalculationService interestCalculationService;
    
    public BorrowingService(BorrowingRepository repo, InterestCalculationService interestCalculationService) { 
        this.repo = repo; 
        this.interestCalculationService = interestCalculationService;
    }
    
    public List<Borrowing> listAll() { return repo.findAll(); }
    public Optional<Borrowing> get(Long id) { return repo.findById(id); }
    public Borrowing save(Borrowing b) { return repo.save(b); }
    public void delete(Long id) { repo.deleteById(id); }
    public List<Borrowing> findByBorrowerId(Long borrowerId) { return repo.findByBorrowerId(borrowerId); }
    
    /**
     * Calculate interest for a specific borrowing
     */
    public BigDecimal calculateInterest(Long borrowingId) {
        Optional<Borrowing> borrowing = repo.findById(borrowingId);
        if (borrowing.isPresent()) {
            return interestCalculationService.calculateInterest(borrowing.get());
        }
        return BigDecimal.ZERO;
    }
    
    /**
     * Calculate total amount (principal + interest) for a specific borrowing
     */
    public BigDecimal calculateTotalAmount(Long borrowingId) {
        Optional<Borrowing> borrowing = repo.findById(borrowingId);
        if (borrowing.isPresent()) {
            return interestCalculationService.calculateTotalAmount(borrowing.get());
        }
        return BigDecimal.ZERO;
    }
    
    /**
     * Get time period description for a borrowing
     */
    public String getTimePeriodDescription(Long borrowingId) {
        Optional<Borrowing> borrowing = repo.findById(borrowingId);
        if (borrowing.isPresent()) {
            return interestCalculationService.getTimePeriodDescription(borrowing.get());
        }
        return "N/A";
    }
}
