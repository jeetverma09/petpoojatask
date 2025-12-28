import React, { useState } from 'react';
import StatsCards from '../components/statsCards/StatsCards';
import ExpenseForm from '../components/expenseForm/ExpenseForm';
import ExpenseTable from '../components/expenseTable/ExpenseTable';
import Modal from '../components/modal/Modal';
import { Toaster } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="dashboard-container">
            <Toaster position="top-right" />

            <header className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>Expense Tracker</h1>
                        <p>Manage your finances with style</p>
                    </div>
                    <button className="btn-add-expense" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={20} />
                        <span>Add Expense</span>
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <section className="stats-section">
                    <StatsCards />
                </section>

                <section className="main-section">
                    <div className="table-wrapper full-width">
                        <ExpenseTable />
                    </div>
                </section>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Expense"
            >
                <ExpenseForm onSuccess={() => setIsAddModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Dashboard;
