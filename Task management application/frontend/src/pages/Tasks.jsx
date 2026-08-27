import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Menu, Plus, Search, Filter, LayoutList } from 'lucide-react';

const Tasks = ({ toggleSidebar }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortBy, setSortBy] = useState('created_at');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // Delete Confirmation
    const [taskToDelete, setTaskToDelete] = useState(null);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks', {
                params: { search, status: statusFilter, priority: priorityFilter, sortBy: sortBy.split('-')[0], order: sortBy.includes('asc') ? 'ASC' : 'DESC' }
            });
            setTasks(res.data.rows || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [search, statusFilter, priorityFilter, sortBy]);

    const handleSaveTask = async (taskData) => {
        try {
            if (taskToEdit) {
                await api.put(`/tasks/${taskToEdit.id}`, taskData);
            } else {
                await api.post('/tasks', taskData);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to save task');
        }
    };

    const handleCompleteTask = async (id) => {
        try {
            await api.patch(`/tasks/${id}`, { status: 'Completed' });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            setTaskToDelete(null);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="menu-btn icon-btn" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <h1 className="page-title">My Tasks</h1>
                </div>
                <button className="btn btn-primary" onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}>
                    <Plus size={20} /> New Task
                </button>
            </div>

            <div className="glass filters-bar" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, minWidth: '200px' }}>
                    <Search size={20} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="input-control search-input"
                        style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <select className="input-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '140px' }}>
                        <option value="">All Status</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select className="input-control" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ width: '140px' }}>
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <select className="input-control" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: '160px' }}>
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                        <option value="due_date-asc">Due Date (Soonest)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner"></div></div>
            ) : tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                    <LayoutList size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <h3>No tasks found</h3>
                    <p>Create a new task to get started or adjust your filters.</p>
                </div>
            ) : (
                <div className="tasks-grid">
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }}
                            onComplete={handleCompleteTask}
                            onDelete={(id) => setTaskToDelete(id)}
                        />
                    ))}
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                taskToEdit={taskToEdit}
            />

            {taskToDelete && (
                <div className="modal-overlay" style={{ zIndex: 60 }}>
                    <div className="glass modal-content">
                        <h2>Delete Task</h2>
                        <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                            <button className="btn btn-outline" onClick={() => setTaskToDelete(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDeleteTask}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
