import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../store/AuthContext';
import api from '../utils/api';
import { Menu, CheckCircle2, Clock, AlertCircle, LayoutList } from 'lucide-react';

const Dashboard = ({ toggleSidebar }) => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        highPriority: 0,
        overdue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/tasks');
                const tasks = res.data.rows || res.data;
                const now = new Date();

                let s = { total: tasks.length, todo: 0, inProgress: 0, completed: 0, highPriority: 0, overdue: 0 };
                tasks.forEach(t => {
                    if (t.status === 'To Do') s.todo++;
                    if (t.status === 'In Progress') s.inProgress++;
                    if (t.status === 'Completed') s.completed++;
                    if (t.priority === 'High' && t.status !== 'Completed') s.highPriority++;
                    if (t.due_date && new Date(t.due_date) < now && t.status !== 'Completed') s.overdue++;
                });
                setStats(s);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="menu-btn icon-btn" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <h1 className="page-title">Welcome, {user?.name.split(' ')[0]}</h1>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner"></div></div>
            ) : (
                <div className="stats-grid">
                    <div className="glass-card stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                                <LayoutList size={24} />
                            </div>
                            <div className="stat-title">Total Tasks</div>
                        </div>
                        <div className="stat-value">{stats.total}</div>
                    </div>

                    <div className="glass-card stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
                                <Clock size={24} />
                            </div>
                            <div className="stat-title">Pending</div>
                        </div>
                        <div className="stat-value">{stats.todo + stats.inProgress}</div>
                    </div>

                    <div className="glass-card stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="stat-title">Completed</div>
                        </div>
                        <div className="stat-value">{stats.completed}</div>
                    </div>

                    <div className="glass-card stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
                                <AlertCircle size={24} />
                            </div>
                            <div className="stat-title">High Priority / Overdue</div>
                        </div>
                        <div className="stat-value">{stats.highPriority} / {stats.overdue}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
