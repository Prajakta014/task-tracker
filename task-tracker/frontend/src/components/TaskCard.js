import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiCalendar, FiTag, FiMoreVertical, FiCheck } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';
import { format, isPast, isToday } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pending', cls: 'badge-pending', next: 'in-progress', nextLabel: 'Start' },
  'in-progress': { label: 'In Progress', cls: 'badge-inprogress', next: 'completed', nextLabel: 'Complete' },
  completed: { label: 'Completed', cls: 'badge-completed', next: 'pending', nextLabel: 'Reopen' }
};

const priorityConfig = {
  low: { label: 'Low', cls: 'badge-low', color: 'var(--priority-low)' },
  medium: { label: 'Medium', cls: 'badge-medium', color: 'var(--priority-medium)' },
  high: { label: 'High', cls: 'badge-high', color: 'var(--priority-high)' }
};

export default function TaskCard({ task, onEdit }) {
  const { updateTaskStatus, deleteTask } = useTaskContext();
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusInfo = statusConfig[task.status] || statusConfig.pending;
  const priorityInfo = priorityConfig[task.priority] || priorityConfig.medium;
  const isCompleted = task.status === 'completed';

  const getDueDateColor = () => {
    if (!task.dueDate) return 'var(--text-muted)';
    const d = new Date(task.dueDate);
    if (isCompleted) return 'var(--text-muted)';
    if (isPast(d) && !isToday(d)) return 'var(--danger)';
    if (isToday(d)) return 'var(--warning)';
    return 'var(--text-muted)';
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task?')) {
      setDeleting(true);
      await deleteTask(task._id);
    }
  };

  const handleStatusToggle = () => {
    updateTaskStatus(task._id, statusInfo.next);
  };

  const priorityBorder = {
    high: '3px solid var(--priority-high)',
    medium: '3px solid var(--priority-medium)',
    low: '3px solid var(--priority-low)'
  }[task.priority] || '3px solid var(--border)';

  return (
    <div
      className="card"
      style={{
        borderLeft: priorityBorder,
        opacity: deleting ? 0.5 : 1,
        position: 'relative',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        {/* Checkbox */}
        <button
          onClick={handleStatusToggle}
          style={{
            width: 22, height: 22, borderRadius: 6, border: `2px solid ${isCompleted ? 'var(--success)' : 'var(--border-hover)'}`,
            background: isCompleted ? 'var(--success)' : 'transparent',
            cursor: 'pointer', flexShrink: 0, marginTop: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title={`Mark as ${statusInfo.next}`}
        >
          {isCompleted && <FiCheck size={13} color="white" strokeWidth={3} />}
        </button>

        {/* Title */}
        <h3 style={{
          flex: 1,
          fontSize: 15,
          fontWeight: 600,
          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
          textDecoration: isCompleted ? 'line-through' : 'none',
          lineHeight: 1.4
        }}>
          {task.title}
        </h3>

        {/* Menu */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setShowMenu(p => !p)}
            style={{ padding: 4 }}
          >
            <FiMoreVertical size={16} />
          </button>
          {showMenu && (
            <div
              style={{
                position: 'absolute', right: 0, top: '100%', zIndex: 100,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                minWidth: 120, boxShadow: 'var(--shadow)', marginTop: 4
              }}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => { onEdit(task); setShowMenu(false); }}
                style={{
                  width: '100%', padding: '8px 14px', background: 'none', border: 'none',
                  color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                  fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <FiEdit2 size={13} /> Edit
              </button>
              <button
                onClick={() => { handleDelete(); setShowMenu(false); }}
                style={{
                  width: '100%', padding: '8px 14px', background: 'none', border: 'none',
                  color: 'var(--danger)', cursor: 'pointer', textAlign: 'left',
                  fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <FiTrash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12,
          paddingLeft: 32, lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {task.description}
        </p>
      )}

      {/* Badges row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingLeft: 32 }}>
        <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
        <span className={`badge ${priorityInfo.cls}`}>{priorityInfo.label}</span>

        {task.dueDate && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: getDueDateColor() }}>
            <FiCalendar size={11} />
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
            {isPast(new Date(task.dueDate)) && !isCompleted && !isToday(new Date(task.dueDate)) && ' ⚠️'}
            {isToday(new Date(task.dueDate)) && !isCompleted && ' Today!'}
          </span>
        )}

        {task.tags?.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent-light)' }}>
            <FiTag size={11} />
            {task.tags.slice(0, 3).join(', ')}
            {task.tags.length > 3 && ` +${task.tags.length - 3}`}
          </span>
        )}
      </div>
    </div>
  );
}
