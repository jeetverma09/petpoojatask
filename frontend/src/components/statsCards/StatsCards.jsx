import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopDays, getMonthlyChange, getPrediction } from '../../api';
import './StatsCards.css';
import { TrendingUp, Calendar, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatSkeleton = () => (
    <div className="stat-content">
        {[1, 2, 3].map(i => (
            <div key={i} className="stat-row skeleton" style={{ height: '35px', border: 'none' }}></div>
        ))}
    </div>
);

const StatsCards = () => {
    const { data: topDays, isLoading: loadingTop } = useQuery({ queryKey: ['topDays'], queryFn: getTopDays });
    const { data: monthlyChange, isLoading: loadingChange } = useQuery({ queryKey: ['monthlyChange'], queryFn: getMonthlyChange });
    const { data: prediction, isLoading: loadingPredict } = useQuery({ queryKey: ['prediction'], queryFn: getPrediction });

    return (
        <div className="stats-grid">
            <div className="stat-card glass-card">
                <div className="stat-header">
                    <div className="stat-icon-wrapper icon-blue">
                        <Calendar size={18} />
                    </div>
                    <h3>Top Spender Days</h3>
                </div>
                {loadingTop ? <StatSkeleton /> : (
                    <div className="stat-content">
                        {topDays?.data?.slice(0, 3).map((item, index) => (
                            <div key={index} className="stat-row">
                                <span className="user-name">{item.user_name}</span>
                                <span className="date">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                <span className="amount">${item.total_spent}</span>
                            </div>
                        ))}
                        {!topDays?.data?.length && <p className="empty-text">No spending history</p>}
                    </div>
                )}
            </div>

            <div className="stat-card glass-card">
                <div className="stat-header">
                    <div className="stat-icon-wrapper icon-purple">
                        <TrendingUp size={18} />
                    </div>
                    <h3>Monthly Velocity</h3>
                </div>
                {loadingChange ? <StatSkeleton /> : (
                    <div className="stat-content">
                        {monthlyChange?.data?.map((item, index) => (
                            <div key={index} className="stat-row">
                                <span className="user-name">{item.user_name}</span>
                                <span className={`change-badge ${item.percentage_change >= 0 ? 'pos' : 'neg'}`}>
                                    {item.percentage_change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {Math.abs(item.percentage_change)}%
                                </span>
                            </div>
                        ))}
                        {!monthlyChange?.data?.length && <p className="empty-text">Not enough data</p>}
                    </div>
                )}
            </div>

            <div className="stat-card glass-card">
                <div className="stat-header">
                    <div className="stat-icon-wrapper icon-orange">
                        <BarChart3 size={18} />
                    </div>
                    <h3>Monthly Forecast</h3>
                </div>
                {loadingPredict ? <StatSkeleton /> : (
                    <div className="stat-content">
                        {prediction?.data?.map((item, index) => (
                            <div key={index} className="stat-row">
                                <span className="user-name">{item.user_name}</span>
                                <span className="prediction-box">
                                    <span className="label">Est.</span>
                                    <span className="amount">${item.predicted_next_month}</span>
                                </span>
                            </div>
                        ))}
                        {!prediction?.data?.length && <p className="empty-text">No predictions yet</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCards;
