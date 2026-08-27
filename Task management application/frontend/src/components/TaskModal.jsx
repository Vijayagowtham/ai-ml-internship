import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        due_date: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setTask({
                ...taskToEdit,
                due_date: taskToEdit.due_date ? new Date(taskToEdit.due_date).toISOString().split('T')[0] : ''
            });
        } else {
            setTask({ title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });
        }
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(task);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
                    <button className="icon-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            required
                            type="text"
                            className="input-control"
                            value={task.title}
                            onChange={e => setTask({ ...task, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="input-control"
                            rows="3"
                            value={task.description}
                            onChange={e => setTask({ ...task, description: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="input-control" value={task.status} onChange={e => setTask({ ...task, status: e.target.value })}>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select className="input-control" value={task.priority} onChange={e => setTask({ ...task, priority: e.target.value })}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            className="input-control"
                            value={task.due_date}
                            onChange={e => setTask({ ...task, due_date: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{taskToEdit ? 'Save Changes' : 'Create Task'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
