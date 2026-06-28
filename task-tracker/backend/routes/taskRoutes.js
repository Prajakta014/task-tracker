const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Task = require('../models/Task');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

const taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional({ nullable: true })
    .custom((val) => {
      if (val === null || val === '') return true;
      return !isNaN(Date.parse(val));
    }).withMessage('Invalid date format')
];

// GET /api/tasks - Get all tasks with filter, sort, search
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'];
    if (allowedSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Task.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: err.message });
  }
});

// GET /api/tasks/stats - Get task statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments();

    const formatted = { pending: 0, 'in-progress': 0, completed: 0 };
    stats.forEach(s => { formatted[s._id] = s.count; });

    const priorityFormatted = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach(s => { priorityFormatted[s._id] = s.count; });

    res.json({
      success: true,
      data: {
        total: totalTasks,
        byStatus: formatted,
        byPriority: priorityFormatted
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: err.message });
  }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', param('id').isMongoId().withMessage('Invalid task ID'), handleValidationErrors, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch task', error: err.message });
  }
});

// POST /api/tasks - Create task
router.post('/', taskValidation, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = new Task({
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || []
    });
    const saved = await task.save();
    res.status(201).json({ success: true, message: 'Task created successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create task', error: err.message });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id',
  param('id').isMongoId().withMessage('Invalid task ID'),
  taskValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, status, priority, dueDate, tags } = req.body;
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, status, priority, dueDate: dueDate || null, tags: tags || [] },
        { new: true, runValidators: true }
      );
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, message: 'Task updated successfully', data: task });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update task', error: err.message });
    }
  }
);

// PATCH /api/tasks/:id/status - Quick status update
router.patch('/:id/status',
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, message: 'Status updated', data: task });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
    }
  }
);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', param('id').isMongoId().withMessage('Invalid task ID'), handleValidationErrors, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete task', error: err.message });
  }
});

// DELETE /api/tasks - Delete all completed tasks
router.delete('/', async (req, res) => {
  try {
    const result = await Task.deleteMany({ status: 'completed' });
    res.json({ success: true, message: `${result.deletedCount} completed tasks deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete tasks', error: err.message });
  }
});

module.exports = router;
