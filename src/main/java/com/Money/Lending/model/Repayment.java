package com.Money.Lending.model;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "repayment")
public class Repayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private java.math.BigDecimal amountRepaid;
    private LocalDate dateRepaid;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "borrowing_id")
    private Borrowing borrowing;

    public Repayment() {}
    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public java.math.BigDecimal getAmountRepaid() { return amountRepaid;}
    public void setAmountRepaid(java.math.BigDecimal amountRepaid) { this.amountRepaid = amountRepaid;}
    public LocalDate getDateRepaid() { return dateRepaid;}
    public void setDateRepaid(LocalDate dateRepaid) { this.dateRepaid = dateRepaid;}
    public String getNotes() { return notes;}
    public void setNotes(String notes) { this.notes = notes;}
    public Borrowing getBorrowing() { return borrowing;}
    public void setBorrowing(Borrowing borrowing) { this.borrowing = borrowing;}
}

