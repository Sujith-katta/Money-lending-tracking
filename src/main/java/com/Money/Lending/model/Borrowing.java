package com.Money.Lending.model;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "borrowing")
public class Borrowing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(precision = 19, scale = 2)
    private BigDecimal amount;

    private Double interestRate; // percent per period
    private String interestCycle; // e.g., ANNUALLY, MONTHLY, NONE

    private LocalDate dateBorrowed;
    private LocalDate repaymentDate;

    private String status; // PENDING, PARTIALLY_REPAID, REPAID, OVERDUE

    @ManyToOne
    @JoinColumn(name = "borrower_id")
    private Borrower borrower;

    // Constructors/getters/setters
    public Borrowing() {}
    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}
    public java.math.BigDecimal getAmount() { return amount;}
    public void setAmount(java.math.BigDecimal amount) { this.amount = amount;}
    public Double getInterestRate() { return interestRate;}
    public void setInterestRate(Double interestRate) { this.interestRate = interestRate;}
    public String getInterestCycle() { return interestCycle;}
    public void setInterestCycle(String interestCycle) { this.interestCycle = interestCycle;}
    public LocalDate getDateBorrowed() { return dateBorrowed;}
    public void setDateBorrowed(LocalDate dateBorrowed) { this.dateBorrowed = dateBorrowed;}
    public LocalDate getRepaymentDate() { return repaymentDate;}
    public void setRepaymentDate(LocalDate repaymentDate) { this.repaymentDate = repaymentDate;}
    public String getStatus() { return status;}
    public void setStatus(String status) { this.status = status;}
    public Borrower getBorrower() { return borrower;}
    public void setBorrower(Borrower borrower) { this.borrower = borrower;}
}
