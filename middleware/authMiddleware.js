const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const HttpError = require("./errorMiddleware");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "7y4r8743r84");
      req.user = decoded.id;
      next();
    } catch (error) {
      console.error(error);
      return next(new HttpError("Not authorized", 401));
    }
  }

  if (!token) {
    return next(new HttpError("Not authorized", 401));
  }
};

const admin = async (req, res, next) => {
  const admin = await Admin.findById(req.user);

  if (admin) {
    next();
  } else {
    return next(new HttpError("Not authorized", 401));
  }
};

module.exports = { protect, admin };
