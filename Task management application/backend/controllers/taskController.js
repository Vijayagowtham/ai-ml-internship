const taskService = require('../services/taskService');

class TaskController {
    async getAllTasks(req, res, next) {
        try {
            const tasks = await taskService.getAllTasks(req.user.id, req.query);
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async getTask(req, res, next) {
        try {
            const task = await taskService.getTask(req.params.id, req.user.id);
            res.json(task);
        } catch (error) {
            if (error.message === 'Task not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    async createTask(req, res, next) {
        try {
            if (!req.body.title) {
                return res.status(400).json({ error: 'Title is required' });
            }
            const task = await taskService.createTask(req.user.id, req.body);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {
            const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
            res.json(task);
        } catch (error) {
            if (error.message === 'Task not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            await taskService.deleteTask(req.params.id, req.user.id);
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            if (error.message === 'Task not found') {
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }
}

module.exports = new TaskController();
