const Admin = require("../models/admin");
const HttpError = require("../middleware/errorMiddleware");
const generateToken = require("../utils/generateToken");

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      return next(
        new HttpError("Admin already exists, please login instead", 422)
      );
    }

    const newAdmin = new Admin({
      name,
      email,
      password,
    });

    const createdAdmin = await newAdmin.save();

    const token = generateToken(createdAdmin._id);

    res.status(201).json({ ...createdAdmin._doc, token });
  } catch (error) {
    return next(new HttpError("Error to Signup new admin", 422));
  }
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPasswords(password))) {
      const token = generateToken(admin._id);

      res.json({ ...admin._doc, token });
    } else {
      return next(new HttpError("Admin not exists, please signup instead", 422));
    }
  } catch (error) {}
};

const getAllAdmins = async (req, res, next) => {
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
      ],
    };
  }
  try {
    const count = await Admin.countDocuments({ ...keyword });
    const admins = await Admin.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ admins, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    return next(new HttpError("Could not fetch admins, please try again", 500));
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);

    res.json(admin);
  } catch (error) {
    return next(new HttpError("Could not find admin", 500));
  }
};

const updateAdmin = async (req, res, next) => {
    const { name, email, password} = req.body;
  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      admin.name = name || admin.name;
      admin.email = email || admin.email;
      admin.password = password || admin.password;


      const updateadmin = await admin.save();

      res.status(201).json(updateadmin);
    } else {
      return next(new HttpError("Could not find admin", 500));
    }
  } catch (error) {
    return next(new HttpError("Could not update admin", 500));
  }
};

const deleteAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.params.id);
    
        if (admin) {
          await admin.remove();
    
          res.status(201).json({ message: "Admin removed" });
        } else {
          return next(new HttpError("Could not find admin", 500));
        }
      } catch (error) {
        return next(new HttpError("Could not delete admin", 500));
      }
};

module.exports = {
  signUp,
  logIn,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};
