require("dotenv").config();

const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const usersRoutes = require("./routes/users/usersRoutes");

const app = express();
dbConnect();

app.use(express.json());
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
