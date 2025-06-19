// backend/controllers/auth.controller.js
const db = require("../models");
const User = db.user; // Assuming user model is correctly loaded in db object
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Input validation (basic)
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Username, email, and password are required." });
    }

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });
    res.status(201).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while registering the user." });
  }
};

exports.signin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while signing in." });
  }
};
