import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Borrower API
export const borrowerAPI = {
  getAll: () => api.get('/borrowers'),
  getById: (id) => api.get(`/borrowers/${id}`),
  create: (borrower) => api.post('/borrowers', borrower),
  update: (id, borrower) => api.put(`/borrowers/${id}`, borrower),
  delete: (id) => api.delete(`/borrowers/${id}`),
  search: (query) => api.get(`/borrowers?q=${query}`),
  clearBorrowerData: (id) => api.delete(`/borrowers/${id}/clear`),
};

// Borrowing API
export const borrowingAPI = {
  getAll: (borrowerId) => {
    const params = borrowerId ? { borrowerId } : {};
    return api.get('/borrowings', { params });
  },
  getById: (id) => api.get(`/borrowings/${id}`),
  create: (borrowing) => api.post('/borrowings', borrowing),
  update: (id, borrowing) => api.put(`/borrowings/${id}`, borrowing),
  delete: (id) => api.delete(`/borrowings/${id}`),
  getInterest: (id) => api.get(`/borrowings/${id}/interest`),
  getTotalAmount: (id) => api.get(`/borrowings/${id}/total`),
  getTimePeriod: (id) => api.get(`/borrowings/${id}/time-period`),
};

// Repayment API
export const repaymentAPI = {
  getAll: (borrowingId) => {
    const params = borrowingId ? { borrowingId } : {};
    return api.get('/repayments', { params });
  },
  getById: (id) => api.get(`/repayments/${id}`),
  create: (repayment) => api.post('/repayments', repayment),
  update: (id, repayment) => api.put(`/repayments/${id}`, repayment),
  delete: (id) => api.delete(`/repayments/${id}`),
};

// Calculation API
export const calculationAPI = {
  calculateTotal: (principal, annualRate, years) => 
    api.get('/calc/total', {
      params: { principal, annualRate, years }
    }),
};

// Clear All API
export const clearAllAPI = {
  clearAll: () => api.delete('/clear-all'),
};

export default api;
