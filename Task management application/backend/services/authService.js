const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
    async register(name, email, password) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const user = await userRepository.create({ name, email, password });

        // Return user without password
        const userWithoutPassword = { id: user.id, name: user.name, email: user.email };
        const token = this.generateToken(user.id);
        return { user: userWithoutPassword, token };
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const userWithoutPassword = { id: user.id, name: user.name, email: user.email };
        const token = this.generateToken(user.id);
        return { user: userWithoutPassword, token };
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
    }

    async verify(userId) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    }
}

module.exports = new AuthService();
