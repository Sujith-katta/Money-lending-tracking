import React, { useState } from 'react';

const BorrowingModal = ({ onClose, onSubmit, borrowers }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    interestRate: '',
    interestCycle: 'NONE',
    dateBorrowed: new Date().toISOString().split('T')[0],
    repaymentDate: '',
    borrowerId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const borrowingData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      interestRate: parseFloat(formData.interestRate) || 0,
      borrower: { id: parseInt(formData.borrowerId) }
    };
    onSubmit(borrowingData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">New Borrowing</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Borrower</label>
            <select
              name="borrowerId"
              value={formData.borrowerId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select borrower</option>
              {borrowers.map(borrower => (
                <option key={borrower.id} value={borrower.id}>
                  {borrower.name} ({borrower.relation})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 1st Borrowing"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Interest Cycle</label>
            <select
              name="interestCycle"
              value={formData.interestCycle}
              onChange={handleChange}
              className="form-select"
            >
              <option value="NONE">None</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="HALF_YEARLY">Half Yearly</option>
              <option value="ANNUALLY">Annually</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              max="100"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Date Borrowed</label>
            <input
              type="date"
              name="dateBorrowed"
              value={formData.dateBorrowed}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Repayment Date</label>
            <input
              type="date"
              name="repaymentDate"
              value={formData.repaymentDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Borrowing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowingModal;
