import React, { useState } from 'react';
import { format } from 'date-fns';

const RepaymentHistory = ({ repayments, borrowings, totalRepaid }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getBorrowerName = (borrowingId) => {
    const borrowing = borrowings.find(b => b.id === borrowingId);
    return borrowing?.borrower?.name || 'Unknown Borrower';
  };

  const filteredRepayments = repayments.filter(repayment => {
    if (activeFilter === 'All') return true;
    // Add more filter logic here if needed
    return true;
  });

  return (
    <div className="section">
      <div className="section-title">
        Repayment History
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

      {filteredRepayments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💳</div>
          <p>No repayments found</p>
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>No. of Repayment</th>
                <th>Borrower</th>
                <th>Amt. Repaid</th>
                <th>Date Repaid</th>
                <th>Files & media</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepayments.map((repayment, index) => (
                <tr key={repayment.id}>
                  <td>{`${index + 1}st Repayment`}</td>
                  <td>{getBorrowerName(repayment.borrowing?.id)}</td>
                  <td>{formatCurrency(repayment.amountRepaid || 0)}</td>
                  <td>{formatDate(repayment.dateRepaid)}</td>
                  <td>-</td>
                  <td>{repayment.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="summary">
            <span>SUM {formatCurrency(totalRepaid)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default RepaymentHistory;
