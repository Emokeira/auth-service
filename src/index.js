const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "Auth Service is running!" });
});

app.listen(PORT, () => {
    console.log(`Auth Service is running on http://localhost:${PORT}`);
});
