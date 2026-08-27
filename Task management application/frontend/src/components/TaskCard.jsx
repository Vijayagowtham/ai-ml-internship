import React from 'react';
import { format } from 'date-fns';
import { Edit2, CheckCircle, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onComplete }) => {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed';

    let badgeColor = 'badge-todo';
    if (task.status === 'In Progress') badgeColor = 'badge-progress';
    if (task.status === 'Completed') badgeColor = 'badge-done';

    let prioClass = 'priority-mid';
    if (task.priority === 'High') prioClass = 'priority-high';
    if (task.priority === 'Low') prioClass = 'priority-low';

    return (
        <div className="glass-card task-card">
            <div className="task-header">
                <h3 className="task-title" style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none', opacity: task.status === 'Completed' ? 0.7 : 1 }}>
                    {task.title}
                </h3>
                <span className={`badge ${badgeColor}`}>{task.status}</span>
            </div>

            {task.description && (
                <p className="task-desc">{task.description}</p>
            )}

            <div className="task-meta">
                <span className={prioClass}>• {task.priority} Priority</span>
                {task.due_date && (
                    <span style={{ color: isOverdue ? 'var(--danger)' : '' }}>
                        Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </span>
                )}
            </div>

            <div className="task-actions">
                {task.status !== 'Completed' && (
                    <button className="icon-btn" onClick={() => onComplete(task.id)} title="Mark Complete">
                        <CheckCircle size={18} />
                    </button>
                )}
                <button className="icon-btn" onClick={() => onEdit(task)} title="Edit Task">
                    <Edit2 size={18} />
                </button>
                <button className="icon-btn danger" onClick={() => onDelete(task.id)} title="Delete Task" style={{ marginLeft: 'auto' }}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
