import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { taskAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  stats: { total: 0, byStatus: { pending: 0, 'in-progress': 0, completed: 0 }, byPriority: { low: 0, medium: 0, high: 0 } },
  loading: false,
  error: null,
  filters: { status: 'all', priority: 'all', search: '', sortBy: 'createdAt', sortOrder: 'desc' }
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    case 'SET_TASKS': return { ...state, tasks: action.payload, loading: false, error: null };
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK': return {
      ...state,
      tasks: state.tasks.map(t => t._id === action.payload._id ? action.payload : t)
    };
    case 'DELETE_TASK': return {
      ...state,
      tasks: state.tasks.filter(t => t._id !== action.payload)
    };
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload } };
    default: return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {};
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.priority && filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      const res = await taskAPI.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      toast.error('Failed to load tasks');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await taskAPI.getStats();
      dispatch({ type: 'SET_STATS', payload: res.data });
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    try {
      const res = await taskAPI.create(data);
      dispatch({ type: 'ADD_TASK', payload: res.data });
      fetchStats();
      toast.success('Task created!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
      return { success: false, error: err.message };
    }
  }, [fetchStats]);

  const updateTask = useCallback(async (id, data) => {
    try {
      const res = await taskAPI.update(id, data);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      fetchStats();
      toast.success('Task updated!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      return { success: false, error: err.message };
    }
  }, [fetchStats]);

  const updateTaskStatus = useCallback(async (id, status) => {
    try {
      const res = await taskAPI.updateStatus(id, status);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      fetchStats();
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  }, [fetchStats]);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.delete(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      fetchStats();
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  }, [fetchStats]);

  const deleteCompleted = useCallback(async () => {
    try {
      await taskAPI.deleteCompleted();
      await fetchTasks(state.filters);
      fetchStats();
      toast.success('Completed tasks cleared');
    } catch (err) {
      toast.error('Failed to clear tasks');
    }
  }, [fetchTasks, fetchStats, state.filters]);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks,
      fetchStats,
      createTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      deleteCompleted,
      setFilters
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};
