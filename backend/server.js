require("dotenv").config();

const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const usersRoutes = require("./routes/users/usersRoutes");
const { notFound, errorHandler } = require("./middleware/error/errorHandler");

const app = express();
dbConnect();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", usersRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
