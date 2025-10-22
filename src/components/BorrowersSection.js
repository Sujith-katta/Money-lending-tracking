

import React, { useState, useEffect } from 'react';
import { borrowerAPI } from '../services/api';

const BorrowersSection = ({ borrowers, calculateStats, onBorrowerClick, onBorrowerDelete }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [clearingId, setClearingId] = useState(null);
  const [borrowerStats, setBorrowerStats] = useState({});

  // Load borrower stats when borrowers change
  useEffect(() => {
    const loadStats = async () => {
      const stats = {};
      for (const borrower of borrowers) {
        try {
          const statsData = await calculateStats(borrower.id);
          stats[borrower.id] = statsData;
        } catch (error) {
          console.error(`Error loading stats for borrower ${borrower.id}:`, error);
          stats[borrower.id] = {
            totalBorrowed: 0,
            totalRepaid: 0,
            outstandingBalance: 0,
            interestOwed: 0,
            totalOutstanding: 0,
            status: 'PENDING',
            borrowingsCount: 0,
            interestRates: [],
            timePeriods: []
          };
        }
      }
      setBorrowerStats(stats);
    };
    
    if (borrowers.length > 0) {
      loadStats();
    }
  }, [borrowers, calculateStats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'REPAID': { class: 'status-repaid', text: 'Repaid', icon: '●' },
      'PARTIALLY_REPAID': { class: 'status-partially-repaid', text: 'Partially Repaid', icon: '●' },
      'PENDING': { class: 'status-pending', text: 'Pending', icon: '●' },
      'OVERDUE': { class: 'status-overdue', text: 'Overdue', icon: '●' }
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-circle"></span>
        {config.text}
      </span>
    );
  };

  const handleDeleteBorrower = async (borrowerId) => {
    if (window.confirm('Are you sure you want to delete this borrower? This action cannot be undone.')) {
      try {
        setDeletingId(borrowerId);
        await borrowerAPI.delete(borrowerId);
        if (onBorrowerDelete) {
          await onBorrowerDelete(borrowerId);
        }
      } catch (error) {
        console.error('Error deleting borrower:', error);
        alert('Error deleting borrower. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleClearBorrower = async (borrowerId) => {
    if (window.confirm('Are you sure you want to clear all data for this borrower? This will reset all amounts to zero but keep the borrower record.')) {
      try {
        setClearingId(borrowerId);
        // Clear all borrowings and repayments for this borrower
        await borrowerAPI.clearBorrowerData(borrowerId);
        if (onBorrowerDelete) {
          await onBorrowerDelete(borrowerId);
        }
      } catch (error) {
        console.error('Error clearing borrower data:', error);
        alert('Error clearing borrower data. Please try again.');
      } finally {
        setClearingId(null);
      }
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    const stats = borrowerStats[borrower.id] || {
      totalBorrowed: 0,
      totalRepaid: 0,
      outstandingBalance: 0,
      interestOwed: 0,
      totalOutstanding: 0,
      status: 'PENDING',
      borrowingsCount: 0,
      interestRates: [],
      timePeriods: []
    };
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return stats.status === 'PENDING';
    if (activeFilter === 'Overdue') return stats.status === 'OVERDUE';
    if (activeFilter === 'Partially Repaid') return stats.status === 'PARTIALLY_REPAID';
    if (activeFilter === 'Repaid') return stats.status === 'REPAID';
    return true;
  });

  return (
    <div className="section">
      <div className="section-title">
        Borrowers
        <button className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
          + New
        </button>
      </div>
      
      <div className="filter-tabs">
        {['All', 'Pending', 'Overdue', 'Partially Repaid', 'Repaid'].map(filter => (
          <button
            key={filter}
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredBorrowers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p>No borrowers found</p>
        </div>
      ) : (
        <div>
          {filteredBorrowers.map(borrower => {
            const stats = borrowerStats[borrower.id] || {
      totalBorrowed: 0,
      totalRepaid: 0,
      outstandingBalance: 0,
      interestOwed: 0,
      totalOutstanding: 0,
      status: 'PENDING',
      borrowingsCount: 0,
      interestRates: [],
      timePeriods: []
    };
            return (
              <div 
                key={borrower.id} 
                className="borrower-card"
                onClick={() => onBorrowerClick && onBorrowerClick(borrower)}
                style={{ cursor: onBorrowerClick ? 'pointer' : 'default' }}
              >
                <div className="borrower-header">
                  <div>
                    <div className="borrower-name">{borrower.name}</div>
                    <div className="borrower-relation">({borrower.relation})</div>
                  </div>
                  {getStatusBadge(stats.status)}
                </div>
                
                <div className="borrower-stats">
                  <div className="stat-item">
                    <div className="stat-label">Total Money Borrowed</div>
                    <div className="stat-value">{formatCurrency(stats.totalBorrowed)}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Total Money Repaid</div>
                    <div className="stat-value">{formatCurrency(stats.totalRepaid)}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Interest Owed</div>
                    <div className="stat-value">{formatCurrency(stats.interestOwed)}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Total Outstanding</div>
                    <div className="stat-value">{formatCurrency(stats.totalOutstanding)}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Interest</div>
                    <div className="stat-value">
                      {stats.interestRates.length > 0 
                        ? `${stats.interestRates.join('%, ')}%`
                        : '0%'
                      }
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">No. of Borrowings</div>
                    <div className="stat-value">{stats.borrowingsCount}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Time Periods</div>
                    <div className="stat-value">
                      {stats.timePeriods.length > 0 
                        ? stats.timePeriods.join(', ')
                        : 'N/A'
                      }
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Outstanding Balance</div>
                    <div className="stat-value">{formatCurrency(stats.outstandingBalance)}</div>
                  </div>
                </div>
                
                <div className="borrower-actions">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-warning"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearBorrower(borrower.id);
                      }}
                      disabled={clearingId === borrower.id}
                    >
                      {clearingId === borrower.id ? 'Clearing...' : 'Clear'}
                    </button>
                    {stats.outstandingBalance === 0 && (
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBorrower(borrower.id);
                        }}
                        disabled={deletingId === borrower.id}
                      >
                        {deletingId === borrower.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BorrowersSection;
