const { User } = require('../models');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findById(id) {
        return await User.findByPk(id, { attributes: { exclude: ['password'] } });
    }

    async create(userData) {
        return await User.create(userData);
    }
}

module.exports = new UserRepository();
