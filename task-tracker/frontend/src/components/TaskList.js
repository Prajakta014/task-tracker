import React from 'react';
import { FiLoader, FiInbox } from 'react-icons/fi';
import TaskCard from './TaskCard';
import { useTaskContext } from '../context/TaskContext';

export default function TaskList({ onEdit }) {
  const { tasks, loading, error } = useTaskContext();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
        <FiLoader size={20} className="spinner" color="var(--accent)" />
        <span style={{ color: 'var(--text-muted)' }}>Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 'var(--radius)', padding: 20, textAlign: 'center',
        color: 'var(--danger)'
      }}>
        ⚠️ {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 20px', gap: 16,
        color: 'var(--text-muted)'
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--bg-card)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: '2px dashed var(--border)'
        }}>
          <FiInbox size={24} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No tasks found</p>
          <p style={{ fontSize: 13 }}>Create a new task or adjust your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tasks.map(task => (
        <TaskCard key={task._id} task={task} onEdit={onEdit} />
      ))}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', paddingTop: 8 }}>
        {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
