import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { useTaskContext } from '../context/TaskContext';

export default function Dashboard() {
  const { fetchTasks, fetchStats, stats, filters, deleteCompleted, tasks } = useTaskContext();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks(filters);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTask(null);
    fetchTasks(filters);
    fetchStats();
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Header />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>
              My Tasks
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {completedCount > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => deleteCompleted()}
                title="Clear all completed tasks"
              >
                <FiTrash2 size={13} />
                Clear done ({completedCount})
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <FiPlus size={16} />
              New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Filters */}
        <FilterBar />

        {/* Task list */}
        <TaskList onEdit={handleEdit} />
      </main>

      {/* Modal */}
      {showForm && (
        <TaskForm task={editTask} onClose={handleCloseForm} />
      )}
    </div>
  );
}
