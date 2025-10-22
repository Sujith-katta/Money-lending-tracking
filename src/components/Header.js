import React from 'react';

const Header = ({ onNewBorrower, onNewBorrowing, onNewRepayment, onClearAll }) => {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">E</div>
        <h1>Borrowed Money Tracker</h1>
      </div>
      <div className="header-actions">
        <button className="btn btn-primary" onClick={onNewBorrower}>
          New Borrower
        </button>
        <button className="btn btn-success" onClick={onNewBorrowing}>
          + New Borrowing
        </button>
        <button className="btn btn-warning" onClick={onNewRepayment}>
          New Repayment
        </button>
        <button className="btn btn-danger" onClick={onClearAll}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Header;
