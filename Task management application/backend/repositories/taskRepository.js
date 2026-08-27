const { Task } = require('../models');

class TaskRepository {
    async findAllByUserId(userId, options = {}) {
        return await Task.findAndCountAll({
            where: { user_id: userId, ...options.where },
            order: options.order || [['created_at', 'DESC']],
        });
    }

    async findByIdAndUserId(id, userId) {
        return await Task.findOne({ where: { id, user_id: userId } });
    }

    async create(taskData) {
        return await Task.create(taskData);
    }

    async update(id, userId, updateData) {
        const task = await this.findByIdAndUserId(id, userId);
        if (!task) return null;
        return await task.update(updateData);
    }

    async delete(id, userId) {
        const task = await this.findByIdAndUserId(id, userId);
        if (!task) return false;
        await task.destroy();
        return true;
    }
}

module.exports = new TaskRepository();
