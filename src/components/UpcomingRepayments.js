import React from 'react';
import { format, differenceInDays } from 'date-fns';

const UpcomingRepayments = ({ repayments }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="section">
      <div className="section-title">
        Upcoming
        <button className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
          + New
        </button>
      </div>
      
      {repayments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p>No upcoming repayments</p>
        </div>
      ) : (
        <div>
          {repayments.map((repayment, index) => (
            <div key={repayment.id || index} className="upcoming-item">
              <div className="upcoming-info">
                <div className="upcoming-borrower">
                  {repayment.borrower?.name || 'Unknown Borrower'}
                </div>
                <div className="upcoming-details">
                  {repayment.title || `${index + 1}st Borrowing`} • Due {formatDate(repayment.repaymentDate)}
                </div>
                <div className="days-left">
                  {repayment.daysLeft} days left
                </div>
              </div>
              <div className="upcoming-amount">
                {formatCurrency(repayment.amount)}
              </div>
              <div style={{ marginLeft: '15px' }}>
                <input type="checkbox" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingRepayments;
