const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

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
                role: (role || 'USER').toUpperCase(), // Default to USER, ensure uppercase
            },
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error(error);
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

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /auth/me
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, fullname: true, email: true, role: true },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});

// GET /auth/admin (ADMIN or MODERATOR)
router.get('/admin', authenticateToken, authorizeRoles('ADMIN', 'MODERATOR'), (req, res) => {
    res.json({ message: `Welcome ${req.user.role}: ${req.user.email}` });
});

// GET /auth/dashboard (ADMIN or MODERATOR)
router.get('/dashboard', authenticateToken, authorizeRoles('ADMIN', 'MODERATOR'), (req, res) => {
    res.json({ message: `Hello ${req.user.role}, welcome to your dashboard.` });
});

// ✅ NEW: GET /auth/users (ADMIN only)
router.get('/users', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                fullname: true,
                email: true,
                role: true,
            }
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

module.exports = router;
