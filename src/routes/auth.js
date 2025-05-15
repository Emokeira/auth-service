const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// POST /auth/signup
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
            },
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request:', { email });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /auth/me
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true },
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// GET /auth/admin (ADMIN and MODERATOR)
router.get('/admin', authenticateToken, authorizeRoles('ADMIN', 'MODERATOR'), (req, res) => {
    res.json({ message: `Welcome ${req.user.role}: ${req.user.email}` });
});

// Optional: GET /auth/dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('ADMIN', 'MODERATOR'), (req, res) => {
    res.json({ message: `Hello ${req.user.role}, welcome to your dashboard.` });
});

// 👇 Move this to the very bottom
module.exports = router;
