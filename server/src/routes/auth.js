const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req, res) => {
    const { fullname, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                role: (role || 'USER').toUpperCase(),
            },
        });

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // ✅ Correct role is included here in the token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /auth/admin (protected route)
router.get('/admin', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
    res.json({ message: `Welcome Admin: ${req.user.email}` });
});

// GET /auth/me (for debugging)
router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
