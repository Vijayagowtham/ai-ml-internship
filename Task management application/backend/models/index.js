const User = require('./User');
const Task = require('./Task');

// A User has many Tasks
User.hasMany(Task, {
    foreignKey: 'user_id',
    as: 'tasks',
    onDelete: 'CASCADE',
});

// A Task belongs to a User
Task.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'owner',
});

module.exports = {
    User,
    Task,
};
