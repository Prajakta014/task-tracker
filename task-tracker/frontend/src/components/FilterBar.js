import React from 'react';
import { FiSearch, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useTaskContext } from '../context/TaskContext';

export default function FilterBar() {
  const { filters, setFilters, fetchTasks } = useTaskContext();

  const update = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    fetchTasks(next);
  };

  return (
    <div style={{
      display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
      marginBottom: 20
    }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 200 }}>
        <FiSearch size={14} style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }} />
        <input
          className="input"
          style={{ paddingLeft: 36 }}
          placeholder="Search tasks..."
          value={filters.search}
          onChange={e => update('search', e.target.value)}
        />
      </div>

      {/* Status filter */}
      <select
        className="select"
        style={{ flex: '0 0 150px' }}
        value={filters.status}
        onChange={e => update('status', e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority filter */}
      <select
        className="select"
        style={{ flex: '0 0 150px' }}
        value={filters.priority}
        onChange={e => update('priority', e.target.value)}
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Sort */}
      <select
        className="select"
        style={{ flex: '0 0 150px' }}
        value={filters.sortBy}
        onChange={e => update('sortBy', e.target.value)}
      >
        <option value="createdAt">Created Date</option>
        <option value="updatedAt">Updated Date</option>
        <option value="title">Title</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      {/* Sort order toggle */}
      <button
        className="btn btn-secondary btn-icon"
        title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        onClick={() => update('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
        style={{ flexShrink: 0 }}
      >
        {filters.sortOrder === 'asc' ? <FiArrowUp size={16} /> : <FiArrowDown size={16} />}
      </button>
    </div>
  );
}
