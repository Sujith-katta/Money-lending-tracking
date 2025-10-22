import React, { useState, useEffect } from 'react';
import { borrowerAPI, borrowingAPI, repaymentAPI, clearAllAPI } from './services/api';
import Header from './components/Header';
import BorrowersSection from './components/BorrowersSection';
import BorrowingsSection from './components/BorrowingsSection';
import UpcomingRepayments from './components/UpcomingRepayments';
import RepaymentHistory from './components/RepaymentHistory';
import BorrowerModal from './components/BorrowerModal';
import BorrowingModal from './components/BorrowingModal';
import RepaymentModal from './components/RepaymentModal';

function App() {
  const [borrowers, setBorrowers] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [borrowersRes, borrowingsRes, repaymentsRes] = await Promise.all([
        borrowerAPI.getAll(),
        borrowingAPI.getAll(),
        repaymentAPI.getAll()
      ]);
      
      setBorrowers(borrowersRes.data);
      setBorrowings(borrowingsRes.data);
      setRepayments(repaymentsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate borrower statistics
  const calculateBorrowerStats = async (borrowerId) => {
    const borrowerBorrowings = borrowings.filter(b => b.borrower?.id === borrowerId);
    const borrowerRepayments = repayments.filter(r => 
      borrowerBorrowings.some(b => b.id === r.borrowing?.id)
    );

    const totalBorrowed = borrowerBorrowings.reduce((sum, b) => 
      sum + (b.amount ? parseFloat(b.amount) : 0), 0
    );
    
    const totalRepaid = borrowerRepayments.reduce((sum, r) => 
      sum + (r.amountRepaid ? parseFloat(r.amountRepaid) : 0), 0
    );

    // Calculate interest owed using backend API
    let interestOwed = 0;
    try {
      const interestPromises = borrowerBorrowings.map(b => 
        borrowingAPI.getInterest(b.id).catch(() => ({ data: 0 }))
      );
      const interestResults = await Promise.all(interestPromises);
      interestOwed = interestResults.reduce((sum, result) => sum + parseFloat(result.data), 0);
    } catch (error) {
      console.error('Error calculating interest:', error);
      interestOwed = 0;
    }

    // Calculate total outstanding balance (principal + interest - repaid)
    const totalOutstanding = totalBorrowed + interestOwed;
    const outstandingBalance = totalOutstanding - totalRepaid;
    
    // Determine status
    let status = 'PENDING';
    if (outstandingBalance === 0 && totalBorrowed > 0) {
      status = 'REPAID';
    } else if (totalRepaid > 0 && outstandingBalance > 0) {
      status = 'PARTIALLY_REPAID';
    }

    // Check for overdue
    const hasOverdue = borrowerBorrowings.some(b => {
      if (!b.repaymentDate) return false;
      const repaymentDate = new Date(b.repaymentDate);
      const today = new Date();
      return repaymentDate < today && b.status !== 'REPAID';
    });

    if (hasOverdue && status !== 'REPAID') {
      status = 'OVERDUE';
    }

    // Calculate time periods for each borrowing using backend API
    let timePeriods = [];
    try {
      const timePeriodPromises = borrowerBorrowings.map(b => 
        borrowingAPI.getTimePeriod(b.id).catch(() => ({ data: 'N/A' }))
      );
      const timePeriodResults = await Promise.all(timePeriodPromises);
      timePeriods = timePeriodResults.map(result => result.data).filter(period => period !== 'N/A');
    } catch (error) {
      console.error('Error calculating time periods:', error);
      timePeriods = [];
    }

    return {
      totalBorrowed,
      totalRepaid,
      outstandingBalance,
      interestOwed,
      totalOutstanding,
      status,
      borrowingsCount: borrowerBorrowings.length,
      interestRates: [...new Set(borrowerBorrowings.map(b => b.interestRate || 0))],
      timePeriods: timePeriods
    };
  };

  // Calculate upcoming repayments
  const getUpcomingRepayments = () => {
    const today = new Date();
    const upcoming = borrowings
      .filter(b => {
        if (!b.repaymentDate || b.status === 'REPAID') return false;
        const repaymentDate = new Date(b.repaymentDate);
        return repaymentDate >= today;
      })
      .sort((a, b) => new Date(a.repaymentDate) - new Date(b.repaymentDate))
      .slice(0, 4);

    return upcoming.map(borrowing => {
      const repaymentDate = new Date(borrowing.repaymentDate);
      const daysLeft = Math.ceil((repaymentDate - today) / (1000 * 60 * 60 * 24));
      
      return {
        ...borrowing,
        daysLeft,
        amount: borrowing.amount ? parseFloat(borrowing.amount) : 0
      };
    });
  };

  // Calculate totals
  const totalBorrowed = borrowings.reduce((sum, b) => 
    sum + (b.amount ? parseFloat(b.amount) : 0), 0
  );
  
  const totalRepaid = repayments.reduce((sum, r) => 
    sum + (r.amountRepaid ? parseFloat(r.amountRepaid) : 0), 0
  );

  const handleCreateBorrower = async (borrowerData) => {
    try {
      const response = await borrowerAPI.create(borrowerData);
      setBorrowers([...borrowers, response.data]);
      setActiveModal(null);
    } catch (error) {
      console.error('Error creating borrower:', error);
    }
  };

  const handleCreateBorrowing = async (borrowingData) => {
    try {
      const response = await borrowingAPI.create(borrowingData);
      setBorrowings([...borrowings, response.data]);
      setActiveModal(null);
    } catch (error) {
      console.error('Error creating borrowing:', error);
    }
  };

  const handleCreateRepayment = async (repaymentData) => {
    try {
      const response = await repaymentAPI.create(repaymentData);
      setRepayments([...repayments, response.data]);
      setActiveModal(null);
      // Reload data to update borrower stats
      loadData();
    } catch (error) {
      console.error('Error creating repayment:', error);
    }
  };

  const handleDeleteBorrower = async (borrowerId) => {
    try {
      // The backend now handles cascading deletes, so we just need to refresh the data
      await loadData();
    } catch (error) {
      console.error('Error deleting borrower:', error);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone and will delete all borrowers, borrowings, and repayments.')) {
      try {
        await clearAllAPI.clearAll();
        // Reset all state to empty arrays
        setBorrowers([]);
        setBorrowings([]);
        setRepayments([]);
        setSelectedBorrower(null);
      } catch (error) {
        console.error('Error clearing all data:', error);
        alert('Error clearing data. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div className="empty-state-icon">⏳</div>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header 
        onNewBorrower={() => setActiveModal('borrower')}
        onNewBorrowing={() => setActiveModal('borrowing')}
        onNewRepayment={() => setActiveModal('repayment')}
        onClearAll={handleClearAll}
      />
      
      <div className="main-content">
        <div>
          <UpcomingRepayments repayments={getUpcomingRepayments()} />
          <BorrowersSection 
            borrowers={borrowers}
            calculateStats={calculateBorrowerStats}
            onBorrowerClick={setSelectedBorrower}
            onBorrowerDelete={handleDeleteBorrower}
          />
        </div>
        <div>
          <BorrowingsSection 
            borrowings={borrowings}
            borrowers={borrowers}
            totalBorrowed={totalBorrowed}
          />
          <RepaymentHistory 
            repayments={repayments}
            borrowings={borrowings}
            totalRepaid={totalRepaid}
          />
        </div>
      </div>

      {activeModal === 'borrower' && (
        <BorrowerModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateBorrower}
        />
      )}

      {activeModal === 'borrowing' && (
        <BorrowingModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateBorrowing}
          borrowers={borrowers}
        />
      )}

      {activeModal === 'repayment' && (
        <RepaymentModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateRepayment}
          borrowings={borrowings}
        />
      )}
    </div>
  );
}

export default App;
