const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "7y4r8743r84", { expiresIn: "50d" });
};

module.exports = generateToken;
