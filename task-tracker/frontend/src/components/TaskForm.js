import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';

const initialForm = {
  title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', tags: ''
};

export default function TaskForm({ task, onClose }) {
  const { createTask, updateTask } = useTaskContext();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : ''
      });
    }
  }, [task]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    else if (form.title.trim().length > 100) errs.title = 'Title cannot exceed 100 characters';
    if (form.description.length > 500) errs.description = 'Description cannot exceed 500 characters';
    if (form.dueDate && isNaN(Date.parse(form.dueDate))) errs.dueDate = 'Invalid date';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    const result = isEdit
      ? await updateTask(task._id, data)
      : await createTask(data);

    setSubmitting(false);
    if (result?.success !== false) onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Title *</label>
            <input
              className={`input ${errors.title ? 'error' : ''}`}
              name="title" value={form.title} onChange={handleChange}
              placeholder="What needs to be done?"
              maxLength={100}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Description</label>
            <textarea
              className={`textarea ${errors.description ? 'error' : ''}`}
              name="description" value={form.description} onChange={handleChange}
              placeholder="Add details (optional)..."
              maxLength={500}
            />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 2 }}>
              {form.description.length}/500
            </p>
            {errors.description && <p className="error-text">{errors.description}</p>}
          </div>

          {/* Status & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label className="label">Status</label>
              <select className="select" name="status" value={form.status} onChange={handleChange}>
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="select" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Due Date</label>
            <input
              className={`input ${errors.dueDate ? 'error' : ''}`}
              type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
            />
            {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma separated)</span></label>
            <input
              className="input"
              name="tags" value={form.tags} onChange={handleChange}
              placeholder="e.g. frontend, bug, urgent"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
