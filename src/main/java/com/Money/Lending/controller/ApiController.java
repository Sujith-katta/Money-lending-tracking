package com.Money.Lending.controller;


import com.Money.Lending.model.Borrower;
import com.Money.Lending.model.Borrowing;
import com.Money.Lending.model.Repayment;
import com.Money.Lending.service.BorrowerService;
import com.Money.Lending.service.BorrowingService;
import com.Money.Lending.service.RepaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {
    private final BorrowerService borrowerService;
    private final BorrowingService borrowingService;
    private final RepaymentService repaymentService;

    public ApiController(BorrowerService borrowerService, BorrowingService borrowingService, RepaymentService repaymentService){
        this.borrowerService = borrowerService;
        this.borrowingService = borrowingService;
        this.repaymentService = repaymentService;
    }

    // Borrowers
    @GetMapping("/borrowers")
    public List<Borrower> listBorrowers(@RequestParam(required = false) String q){
        if(q != null && !q.isBlank()) return borrowerService.searchByName(q);
        return borrowerService.listAll();
    }
    @PostMapping("/borrowers")
    public Borrower createBorrower(@RequestBody Borrower b){ return borrowerService.save(b); }
    @GetMapping("/borrowers/{id}")
    public ResponseEntity<Borrower> getBorrower(@PathVariable Long id){
        Optional<Borrower> o = borrowerService.get(id);
        return o.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/borrowers/{id}")
    public ResponseEntity<Void> deleteBorrower(@PathVariable Long id){
        // Delete related borrowings and repayments first
        List<Borrowing> borrowerBorrowings = borrowingService.findByBorrowerId(id);
        for (Borrowing borrowing : borrowerBorrowings) {
            // Delete all repayments for this borrowing
            List<Repayment> repayments = repaymentService.findByBorrowingId(borrowing.getId());
            for (Repayment repayment : repayments) {
                repaymentService.delete(repayment.getId());
            }
            // Delete the borrowing
            borrowingService.delete(borrowing.getId());
        }
        // Finally delete the borrower
        borrowerService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/borrowers/{id}/clear")
    public ResponseEntity<Void> clearBorrowerData(@PathVariable Long id){
        // Clear all borrowings and repayments for this borrower but keep the borrower record
        List<Borrowing> borrowerBorrowings = borrowingService.findByBorrowerId(id);
        for (Borrowing borrowing : borrowerBorrowings) {
            // Delete all repayments for this borrowing
            List<Repayment> repayments = repaymentService.findByBorrowingId(borrowing.getId());
            for (Repayment repayment : repayments) {
                repaymentService.delete(repayment.getId());
            }
            // Delete the borrowing
            borrowingService.delete(borrowing.getId());
        }
        // Keep the borrower record but clear all associated data
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/clear-all")
    public ResponseEntity<Void> clearAllData(){
        // Delete all repayments
        List<Repayment> allRepayments = repaymentService.listAll();
        for (Repayment repayment : allRepayments) {
            repaymentService.delete(repayment.getId());
        }
        
        // Delete all borrowings
        List<Borrowing> allBorrowings = borrowingService.listAll();
        for (Borrowing borrowing : allBorrowings) {
            borrowingService.delete(borrowing.getId());
        }
        
        // Delete all borrowers
        List<Borrower> allBorrowers = borrowerService.listAll();
        for (Borrower borrower : allBorrowers) {
            borrowerService.delete(borrower.getId());
        }
        
        return ResponseEntity.ok().build();
    }

    // Borrowings
    @GetMapping("/borrowings")
    public List<Borrowing> listBorrowings(@RequestParam(required = false) Long borrowerId){
        if(borrowerId != null) return borrowingService.findByBorrowerId(borrowerId);
        return borrowingService.listAll();
    }
    @PostMapping("/borrowings")
    public Borrowing createBorrowing(@RequestBody Borrowing b){
        // minimal server-side calculation example: compute total with interest (simple interest)
        if(b.getAmount() == null) b.setAmount(BigDecimal.ZERO);
        if(b.getInterestRate() == null) b.setInterestRate(0.0);
        // set default dates if null
        if(b.getDateBorrowed() == null) b.setDateBorrowed(LocalDate.now());
        Borrowing saved = borrowingService.save(b);
        return saved;
    }
    @GetMapping("/borrowings/{id}")
    public ResponseEntity<Borrowing> getBorrowing(@PathVariable Long id){
        Optional<Borrowing> o = borrowingService.get(id);
        return o.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/borrowings/{id}")
    public ResponseEntity<Void> deleteBorrowing(@PathVariable Long id){
        borrowingService.delete(id);
        return ResponseEntity.ok().build();
    }

    // Repayments
    @GetMapping("/repayments")
    public List<Repayment> listRepayments(@RequestParam(required = false) Long borrowingId){
        if(borrowingId != null) return repaymentService.findByBorrowingId(borrowingId);
        return repaymentService.listAll();
    }
    @PostMapping("/repayments")
    public Repayment createRepayment(@RequestBody Repayment r){
        if(r.getDateRepaid()==null) r.setDateRepaid(LocalDate.now());
        return repaymentService.save(r);
    }
    @DeleteMapping("/repayments/{id}")
    public ResponseEntity<Void> deleteRepayment(@PathVariable Long id){
        repaymentService.delete(id);
        return ResponseEntity.ok().build();
    }

    // Interest calculation endpoints
    @GetMapping("/borrowings/{id}/interest")
    public ResponseEntity<BigDecimal> getInterest(@PathVariable Long id) {
        BigDecimal interest = borrowingService.calculateInterest(id);
        return ResponseEntity.ok(interest);
    }
    
    @GetMapping("/borrowings/{id}/total")
    public ResponseEntity<BigDecimal> getTotalAmount(@PathVariable Long id) {
        BigDecimal total = borrowingService.calculateTotalAmount(id);
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/borrowings/{id}/time-period")
    public ResponseEntity<String> getTimePeriod(@PathVariable Long id) {
        String timePeriod = borrowingService.getTimePeriodDescription(id);
        return ResponseEntity.ok(timePeriod);
    }
    
    // Simple calculation endpoint to compute total including simple interest (legacy)
    @GetMapping("/calc/total")
    public BigDecimal calcTotal(@RequestParam BigDecimal principal, @RequestParam double annualRate, @RequestParam int years){
        BigDecimal interest = principal.multiply(BigDecimal.valueOf(annualRate)).multiply(BigDecimal.valueOf(years)).divide(BigDecimal.valueOf(100));
        return principal.add(interest);
    }
}
