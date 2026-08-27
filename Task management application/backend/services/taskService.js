const taskRepository = require('../repositories/taskRepository');
const { Op } = require('sequelize');

class TaskService {
    async getAllTasks(userId, query) {
        const { status, priority, search, sortBy = 'created_at', order = 'DESC' } = query;
        let where = {};

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        return await taskRepository.findAllByUserId(userId, {
            where,
            order: [[sortBy, order]]
        });
    }

    async getTask(id, userId) {
        const task = await taskRepository.findByIdAndUserId(id, userId);
        if (!task) throw new Error('Task not found');
        return task;
    }

    async createTask(userId, data) {
        if (!data.title) throw new Error('Title is required');
        return await taskRepository.create({ ...data, user_id: userId });
    }

    async updateTask(id, userId, data) {
        const task = await taskRepository.update(id, userId, data);
        if (!task) throw new Error('Task not found');
        return task;
    }

    async deleteTask(id, userId) {
        const success = await taskRepository.delete(id, userId);
        if (!success) throw new Error('Task not found');
        return success;
    }
}

module.exports = new TaskService();
