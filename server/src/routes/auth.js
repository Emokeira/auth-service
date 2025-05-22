const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ 
            message: 'User created successfully', 
            user: { id: user.id, email: user.email, fullname: user.fullname } 
        });
    } catch (error) {
        console.error(error);  // Log the actual error message
        res.status(500).json({ error: 'Signup failed' });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your .env
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error); // Log the actual error message
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /auth/me (protected route)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, fullname: true, email: true },
        });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

module.exports = router;
