import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExpenses, getUsers, getCategories, deleteExpense } from '../../api';
import './ExpenseTable.css';
import { Filter, Calendar, Pencil, Trash2, XCircle, Search, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../modal/Modal';
import ConfirmationModal from '../confirmationModal/ConfirmationModal';
import ExpenseForm from '../expenseForm/ExpenseForm';

const ExpenseTable = () => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({
        user_id: '',
        category: '',
        start_date: '',
        end_date: ''
    });

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const { data: expenses, isLoading, isError } = useQuery({
        queryKey: ['expenses', filters],
        queryFn: () => getExpenses(filters)
    });

    const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses']);
            queryClient.invalidateQueries(['topDays']);
            queryClient.invalidateQueries(['monthlyChange']);
            queryClient.invalidateQueries(['prediction']);
            toast.success('Expense deleted successfully');
            setIsDeleteModalOpen(false);
            setSelectedExpense(null);
        },
        onError: (err) => toast.error('Error deleting: ' + err.message)
    });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            user_id: '',
            category: '',
            start_date: '',
            end_date: ''
        });
    };

    const hasFilters = !!(filters.user_id || filters.category || filters.start_date || filters.end_date);

    // Handlers
    const onEditClick = (expense) => {
        setSelectedExpense(expense);
        setIsEditModalOpen(true);
    };

    const onDeleteClick = (expense) => {
        setSelectedExpense(expense);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedExpense) {
            deleteMutation.mutate(selectedExpense.id);
        }
    };

    return (
        <div className="expense-table-container glass-card">
            <div className="filters-bar">
                <div className="filter-group-main">
                    <div className="filter-item">
                        <label>User</label>
                        <select name="user_id" value={filters.user_id} onChange={handleFilterChange}>
                            <option value="">All Users</option>
                            {users?.data?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>Category</label>
                        <select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            {categories?.data?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="filter-item">
                        <label>From</label>
                        <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
                    </div>

                    <div className="filter-item">
                        <label>To</label>
                        <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
                    </div>

                    {hasFilters && (
                        <button className="btn-clear" onClick={clearFilters} title="Clear Filters">
                            <XCircle size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="table-responsive">
                <table className="expenses-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>User</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th className="text-right">Amount</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" className="loading-state">Loading expenses...</td></tr>
                        ) : isError ? (
                            <tr><td colSpan="6" className="error-state">Error loading records</td></tr>
                        ) : expenses?.data?.length > 0 ? (
                            expenses.data.map(expense => (
                                <tr key={expense.id} className="fade-in">
                                    <td className="date-cell">
                                        {new Date(expense.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="user-cell">{expense.user_name}</td>
                                    <td>
                                        <span className="category-badge">{expense.category_name}</span>
                                    </td>
                                    <td className="desc-cell">{expense.description || <span className="no-desc">No description</span>}</td>
                                    <td className="text-right amount-cell">${parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="text-center actions-cell">
                                        <button onClick={() => onEditClick(expense)} className="action-btn edit" title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => onDeleteClick(expense)} className="action-btn delete" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    <div className="empty-content">
                                        <Inbox size={48} strokeWidth={1} />
                                        <p>No expenses found</p>
                                        {hasFilters && <button onClick={clearFilters} className="clear-link">Clear filters</button>}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Expense"
            >
                {selectedExpense && (
                    <ExpenseForm
                        initialData={selectedExpense}
                        onSuccess={() => setIsEditModalOpen(false)}
                    />
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};

export default ExpenseTable;
