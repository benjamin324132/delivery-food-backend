const User = require("../models/user");
const HttpError = require("../middleware/errorMiddleware");
const generateToken = require("../utils/generateToken");
const { findByIdAndUpdate } = require("../models/user");

const signUp = async (req, res, next) => {
  const { name, email, password, phone, deviceToken, adress } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return next(
        new HttpError("User already exists, please login instead", 422)
      );
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      deviceToken,
      adress,
    });

    const createdUser = await newUser.save();

    const token = generateToken(createdUser._id);

    res.status(201).json({ ...createdUser._doc, token });
  } catch (error) {
    return next(new HttpError("Error to Signup new user", 422));
  }
};

const logIn = async (req, res, next) => {
  const { email, password, deviceToken } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPasswords(password))) {
      const token = generateToken(user._id);
      const updateToken = await User.findOneAndUpdate({_id: user._id}, {deviceToken})
      res.json({ ...user._doc, token });
    } else {
      return next(new HttpError("User not exists, please signup instead", 422));
    }
  } catch (error) {
    console.log(error)
    return next(new HttpError("Error to login, try again", 422));
  }
};

const getAllUsers = async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  let keyword = {};
  if (req.query.keyword) {
    keyword = {
      $or: [
        {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: req.query.keyword,
            $options: "i",
          },
        },
      ],
    };
  }
  try {
    const count = await User.countDocuments({ ...keyword });
    const users = await User.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ users, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    return next(new HttpError("Could not fetch users, please try again", 500));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.json(user);
  } catch (error) {
    return next(new HttpError("Could not find user", 500));
  }
};

const updateUser = async (req, res, next) => {
    const { name, email, password, bio, adress, active} = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.bio = bio || user.bio;
      user.adress = adress || user.adress;
      if(active) {
        user.active = active == 1 ? true : false
      }

      const updateuser = await user.save();

      res.status(201).json(updateuser);
    } else {
      return next(new HttpError("Could not find user", 500));
    }
  } catch (error) {
    return next(new HttpError("Could not update user", 500));
  }
};

const updateMe = async (req, res, next) => {
  const { name, email, password, bio, adress, active} = req.body;
try {
  const user = await User.findById(req.user);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.bio = bio || user.bio;
    user.adress = adress || user.adress;
    if(active) {
      user.active = active == 1 ? true : false
    }

    const updateuser = await user.save();

    res.status(201).json(updateuser);
  } else {
    return next(new HttpError("Could not find user", 500));
  }
} catch (error) {
  return next(new HttpError("Could not update user", 500));
}
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
    
        if (user) {
          await user.remove();
    
          res.status(201).json({ message: "User removed" });
        } else {
          return next(new HttpError("Could not find user", 500));
        }
      } catch (error) {
        return next(new HttpError("Could not delete user", 500));
      }
};

module.exports = {
  signUp,
  logIn,
  getAllUsers,
  getUserById,
  updateUser,
  updateMe,
  deleteUser
};
