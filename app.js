// Standard library imports
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const User = require("./models/user");

const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");

dotenv.config();

// Initialize the Express application
const app = express();

// Middleware to parse request bodies and static files serving
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Connect to MongoDB and start the server within the connection callback
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exits the process if MongoDB connection fails
  });

// Route imports
const surveyRoutes = require("./routes/surveyroutes");

// Use survey routes
app.use("/surveys", surveyRoutes);

// Define a route for the home page
app.get("/", (req, res) => {
  res.render("home"); // Renders the home.ejs as the landing page
});

// Showing register form
app.get("/register", function (req, res) {
  res.render("register");
});
// Handling user signup
app.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.pname,
    password: req.body.pword,
  });
  // res.send(user);
  // return res.status(200).json(user);
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//Handling user login
app.post("/login", async function (req, res) {
  try {
    // check if the user exists
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;

      if (result) {
        // res.redirect("/");
        res.status(200).json({ success: true, data: user });
      } else {
        res
          .status(401)
          .json({ success: false, error: "Incorrect username or password" });
      }
    } else {
      // res.status(402).json({ error: "User doesn't exist" });
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/logout", function (req, res) {
  res.redirect("/");
});
