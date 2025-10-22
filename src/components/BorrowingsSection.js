import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { borrowingAPI } from '../services/api';

const BorrowingsSection = ({ borrowings, borrowers, totalBorrowed }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [borrowingDetails, setBorrowingDetails] = useState({});
  const [totalWithInterest, setTotalWithInterest] = useState(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Load borrowing details from backend
  useEffect(() => {
    const loadBorrowingDetails = async () => {
      const details = {};
      let total = 0;
      
      for (const borrowing of borrowings) {
        try {
          const [interestRes, totalRes] = await Promise.all([
            borrowingAPI.getInterest(borrowing.id),
            borrowingAPI.getTotalAmount(borrowing.id)
          ]);
          
          details[borrowing.id] = {
            interest: interestRes.data,
            totalAmount: totalRes.data
          };
          
          total += parseFloat(totalRes.data);
        } catch (error) {
          console.error(`Error loading details for borrowing ${borrowing.id}:`, error);
          details[borrowing.id] = {
            interest: 0,
            totalAmount: borrowing.amount || 0
          };
          total += parseFloat(borrowing.amount || 0);
        }
      }
      
      setBorrowingDetails(details);
      setTotalWithInterest(total);
    };
    
    if (borrowings.length > 0) {
      loadBorrowingDetails();
    }
  }, [borrowings]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getBorrowerName = (borrowerId) => {
    const borrower = borrowers.find(b => b.id === borrowerId);
    return borrower ? borrower.name : 'Unknown Borrower';
  };

  const getInterestCycleDisplay = (cycle, rate) => {
    if (!cycle || cycle === 'NONE') return '0%';
    return `${rate || 0}%`;
  };

  const filteredBorrowings = borrowings.filter(borrowing => {
    if (activeFilter === 'All') return true;
    return borrowing.status === activeFilter.toUpperCase();
  });

  return (
    <div className="section">
      <div className="section-title">
        + Borrowings
        <button className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
          + New
        </button>
      </div>
      
      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'All' ? 'active' : ''}`}
          onClick={() => setActiveFilter('All')}
        >
          All
        </button>
      </div>

      {filteredBorrowings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <p>No borrowings found</p>
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>No. of Borrowings</th>
                <th>Borrower</th>
                <th>Amount</th>
                <th>Interest Cycle</th>
                <th>Interest</th>
                <th>Date Borrowed</th>
                <th>Repayment Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowings.map((borrowing, index) => (
                <tr key={borrowing.id}>
                  <td>{borrowing.title || `${index + 1}st Borrowing`}</td>
                  <td>{getBorrowerName(borrowing.borrower?.id)}</td>
                  <td>{formatCurrency(borrowing.amount || 0)}</td>
                  <td>{borrowing.interestCycle || 'NONE'}</td>
                  <td>{getInterestCycleDisplay(borrowing.interestCycle, borrowing.interestRate)}</td>
                  <td>{formatDate(borrowing.dateBorrowed)}</td>
                  <td>{formatDate(borrowing.repaymentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="summary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Principal: {formatCurrency(totalBorrowed)}</span>
              <span>Total with Interest: {formatCurrency(totalWithInterest)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BorrowingsSection;
