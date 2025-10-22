import React, { useState } from 'react';

const RepaymentModal = ({ onClose, onSubmit, borrowings }) => {
  const [formData, setFormData] = useState({
    amountRepaid: '',
    dateRepaid: new Date().toISOString().split('T')[0],
    notes: '',
    borrowingId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const repaymentData = {
      ...formData,
      amountRepaid: parseFloat(formData.amountRepaid) || 0,
      borrowing: { id: parseInt(formData.borrowingId) }
    };
    onSubmit(repaymentData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getBorrowerName = (borrowingId) => {
    const borrowing = borrowings.find(b => b.id === borrowingId);
    return borrowing?.borrower?.name || 'Unknown Borrower';
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">New Repayment</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Borrowing</label>
            <select
              name="borrowingId"
              value={formData.borrowingId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select borrowing</option>
              {borrowings.map(borrowing => (
                <option key={borrowing.id} value={borrowing.id}>
                  {borrowing.title || `${borrowing.id}st Borrowing`} - {getBorrowerName(borrowing.id)} 
                  (₹{borrowing.amount || 0})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount Repaid</label>
            <input
              type="number"
              name="amountRepaid"
              value={formData.amountRepaid}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Date Repaid</label>
            <input
              type="date"
              name="dateRepaid"
              value={formData.dateRepaid}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Optional notes about this repayment"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Repayment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepaymentModal;
