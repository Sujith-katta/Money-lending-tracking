package com.Money.Lending.service;

import com.Money.Lending.model.Borrowing;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class InterestCalculationService {
    
    public enum InterestCycle {
        NONE, MONTHLY, QUARTERLY, HALF_YEARLY, ANNUALLY
    }
    
    /**
     * Calculate interest for a borrowing based on its interest cycle and time period
     */
    public BigDecimal calculateInterest(Borrowing borrowing) {
        if (borrowing.getInterestRate() == null || borrowing.getInterestRate() == 0) {
            return BigDecimal.ZERO;
        }
        
        if (borrowing.getAmount() == null || borrowing.getAmount().equals(BigDecimal.ZERO)) {
            return BigDecimal.ZERO;
        }
        
        if (borrowing.getDateBorrowed() == null || borrowing.getRepaymentDate() == null) {
            return BigDecimal.ZERO;
        }
        
        LocalDate startDate = borrowing.getDateBorrowed();
        LocalDate endDate = borrowing.getRepaymentDate();
        
        // Calculate the number of days between dates
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
        
        if (daysBetween <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal principal = borrowing.getAmount();
        BigDecimal rate = BigDecimal.valueOf(borrowing.getInterestRate());
        
        InterestCycle cycle = InterestCycle.valueOf(borrowing.getInterestCycle().toUpperCase());
        
        switch (cycle) {
            case MONTHLY:
                return calculateMonthlyInterest(principal, rate, daysBetween);
            case QUARTERLY:
                return calculateQuarterlyInterest(principal, rate, daysBetween);
            case HALF_YEARLY:
                return calculateHalfYearlyInterest(principal, rate, daysBetween);
            case ANNUALLY:
                return calculateAnnualInterest(principal, rate, daysBetween);
            case NONE:
            default:
                return BigDecimal.ZERO;
        }
    }
    
    /**
     * Calculate total amount (principal + interest) for a borrowing
     */
    public BigDecimal calculateTotalAmount(Borrowing borrowing) {
        BigDecimal principal = borrowing.getAmount() != null ? borrowing.getAmount() : BigDecimal.ZERO;
        BigDecimal interest = calculateInterest(borrowing);
        return principal.add(interest);
    }
    
    /**
     * Calculate monthly interest
     * Rate is per month, so we calculate based on the number of months
     */
    private BigDecimal calculateMonthlyInterest(BigDecimal principal, BigDecimal rate, long daysBetween) {
        // Convert days to months (using 30.44 days per month average)
        BigDecimal months = BigDecimal.valueOf(daysBetween).divide(BigDecimal.valueOf(30.44), 4, RoundingMode.HALF_UP);
        return principal.multiply(rate).multiply(months).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
    
    /**
     * Calculate quarterly interest
     * Rate is per quarter (3 months), so we calculate based on the number of quarters
     */
    private BigDecimal calculateQuarterlyInterest(BigDecimal principal, BigDecimal rate, long daysBetween) {
        // Convert days to quarters (using 91.25 days per quarter average)
        BigDecimal quarters = BigDecimal.valueOf(daysBetween).divide(BigDecimal.valueOf(91.25), 4, RoundingMode.HALF_UP);
        return principal.multiply(rate).multiply(quarters).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
    
    /**
     * Calculate half-yearly interest
     * Rate is per half year (6 months), so we calculate based on the number of half years
     */
    private BigDecimal calculateHalfYearlyInterest(BigDecimal principal, BigDecimal rate, long daysBetween) {
        // Convert days to half years (using 182.5 days per half year average)
        BigDecimal halfYears = BigDecimal.valueOf(daysBetween).divide(BigDecimal.valueOf(182.5), 4, RoundingMode.HALF_UP);
        return principal.multiply(rate).multiply(halfYears).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
    
    /**
     * Calculate annual interest
     * Rate is per year, so we calculate based on the number of years
     */
    private BigDecimal calculateAnnualInterest(BigDecimal principal, BigDecimal rate, long daysBetween) {
        // Convert days to years (using 365 days per year)
        BigDecimal years = BigDecimal.valueOf(daysBetween).divide(BigDecimal.valueOf(365), 4, RoundingMode.HALF_UP);
        return principal.multiply(rate).multiply(years).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
    
    /**
     * Get the time period description for a borrowing
     */
    public String getTimePeriodDescription(Borrowing borrowing) {
        if (borrowing.getDateBorrowed() == null || borrowing.getRepaymentDate() == null) {
            return "N/A";
        }
        
        LocalDate startDate = borrowing.getDateBorrowed();
        LocalDate endDate = borrowing.getRepaymentDate();
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
        
        if (daysBetween <= 0) {
            return "0 days";
        }
        
        InterestCycle cycle = InterestCycle.valueOf(borrowing.getInterestCycle().toUpperCase());
        
        switch (cycle) {
            case MONTHLY:
                long months = Math.round(daysBetween / 30.44);
                return months + " month" + (months != 1 ? "s" : "");
            case QUARTERLY:
                long quarters = Math.round(daysBetween / 91.25);
                return quarters + " quarter" + (quarters != 1 ? "s" : "");
            case HALF_YEARLY:
                long halfYears = Math.round(daysBetween / 182.5);
                return halfYears + " half year" + (halfYears != 1 ? "s" : "");
            case ANNUALLY:
                long years = Math.round(daysBetween / 365);
                return years + " year" + (years != 1 ? "s" : "");
            case NONE:
            default:
                return daysBetween + " day" + (daysBetween != 1 ? "s" : "");
        }
    }
}
