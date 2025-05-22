const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet'); // ✅ correct usage with require

dotenv.config();

const app = express();
app.use(helmet());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
