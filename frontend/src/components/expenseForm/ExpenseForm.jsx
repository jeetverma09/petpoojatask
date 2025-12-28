import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getCategories, createExpense, updateExpense } from '../../api';
import './ExpenseForm.css';
import { PlusCircle, Save, Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ExpenseForm = ({ initialData, onSuccess }) => {
    const queryClient = useQueryClient();
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        user_id: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                user_id: initialData.user_id,
                category: initialData.category_id || initialData.category,
                amount: initialData.amount,
                date: initialData.date.split('T')[0],
                description: initialData.description || ''
            });
        }
    }, [initialData]);

    const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

    const mutation = useMutation({
        mutationFn: (data) => {
            if (isEditMode) {
                return updateExpense(initialData.id, data);
            }
            return createExpense(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses']);
            queryClient.invalidateQueries(['topDays']);
            queryClient.invalidateQueries(['monthlyChange']);
            queryClient.invalidateQueries(['prediction']);

            if (!isEditMode) {
                setFormData({
                    user_id: '',
                    category: '',
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: ''
                });
            }

            toast.success(isEditMode ? 'Expense updated successfully!' : 'Expense added successfully!');
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            toast.error('Error: ' + (err.response?.data?.error || err.message));
        }
    });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.user_id) newErrors.user_id = 'User is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }
        if (!formData.date) newErrors.date = 'Date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        mutation.mutate(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            {!initialData && <h2>Add New Expense</h2>}

            <div className="form-group">
                <label>User</label>
                <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    className={errors.user_id ? 'error' : ''}
                >
                    <option value="">Select User</option>
                    {users?.data?.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                {errors.user_id && <span className="error-message">{errors.user_id}</span>}
            </div>

            <div className="form-group">
                <label>Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'error' : ''}
                >
                    <option value="">Select Category</option>
                    {categories?.data?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className={errors.amount ? 'error' : ''}
                />
                {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description..."
                />
            </div>

            <button type="submit" className="submit-btn" disabled={mutation.isPending}>
                {mutation.isPending ? (
                    <Loader className="spin" size={18} />
                ) : isEditMode ? (
                    <Save size={18} />
                ) : (
                    <PlusCircle size={18} />
                )}
                <span>{mutation.isPending ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Expense')}</span>
            </button>
        </form>
    );
};

export default ExpenseForm;
