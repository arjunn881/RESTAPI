const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/userRouter");
const authRoute = require("./routes/authRouter");
const postRoute = require('./routes/postRouter');


dotenv.config();
mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res, next) => {
  res.send("Welcome to homepage");
  next();
});

app.listen(8000, () => {
  console.log("backend server is running in 8000");
});
