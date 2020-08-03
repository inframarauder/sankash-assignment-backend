const User = require("../models/user.model");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

exports.signup = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({ error: "This username is already taken" });
    } else {
      user = await new User(req.body).save();
      let accessToken = await user.createAccessToken();
      let refreshToken = await user.createRefreshToken();

      return res
        .status(201)
        .json({ accessToken, refreshToken, user: user.username });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    } else {
      let valid = await bcrypt.compare(req.body.password, user.password);
      if (valid) {
        let accessToken = await user.createAccessToken();
        let refreshToken = await user.createRefreshToken();

        return res
          .status(201)
          .json({ accessToken, refreshToken, user: user.username });
      } else {
        return res.status(400).json({ error: "Passwords do not match!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.generateRefreshToken = async (req, res) => {
  try {
    let tokenDoc = await Token.findOne({ token: req.body.token });
    if (!tokenDoc) {
      return res
        .status(404)
        .json({ error: "Token expired. Please login again!" });
    } else {
      //extract payload from refresh token and generate a new access token and send it
      const payload = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET);
      const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
      });
      return res.status(200).json({ accessToken });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    //delete the refresh token saved in database:
    const { token } = req.body;
    await Token.findOneAndDelete({ token });
    return res.status(200).json({ success: "User logged out!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
