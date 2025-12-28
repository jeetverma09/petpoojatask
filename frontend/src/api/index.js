import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const getUsers = () => api.get('/master/users');
export const getCategories = () => api.get('/master/categories');

export const getTopDays = () => api.get('/stats/top-days');
export const getMonthlyChange = () => api.get('/stats/monthly-change');
export const getPrediction = () => api.get('/stats/prediction');

export default api;
