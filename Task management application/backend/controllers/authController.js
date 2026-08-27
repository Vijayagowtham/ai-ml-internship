const authService = require('../services/authService');

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required' });
            }
            // Simple email validation regex
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters long' });
            }
            const data = await authService.register(name, email, password);
            res.status(201).json(data);
        } catch (error) {
            if (error.message === 'Email already in use') {
                return res.status(400).json({ error: error.message });
            }
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const data = await authService.login(email, password);
            res.json(data);
        } catch (error) {
            if (error.message === 'Invalid email or password') {
                return res.status(401).json({ error: error.message });
            }
            next(error);
        }
    }

    async verify(req, res, next) {
        try {
            const user = await authService.verify(req.user.id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res) {
        // In a stateless JWT setup, logout is typically handled client-side by deleting the token.
        // Here we just send a success message.
        res.json({ message: 'Logged out successfully' });
    }
}

module.exports = new AuthController();
