const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ✅ Role-checking middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role?.toUpperCase();

    console.log("User role:", userRole);
    console.log("Allowed roles:", allowedRoles);

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
};
