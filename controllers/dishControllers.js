const Dish = require("../models/dish");
const HttpError = require("../middleware/errorMiddleware");

const addNewDish = async (req, res, next) => {
  const { name, image, price, desc, category, lat, long } = req.body;
  try {
    const newDish = await new Dish({
      name,
      image,
      price,
      desc,
      category,
      loc: {
        type: "Point",
        coordinates: [long, lat],
      },
    });

    const createdDish = await newDish.save();

    res.status(201).json(createdDish);
  } catch (error) {
    return next(new HttpError("Could not add dish, please try again", 500));
  }
};

const getDishes = async (req, res, next) => {
  const pageSize = 15;
  const page = Number(req.query.pageNumber) || 1;

  let keyword = {
    active: { $ne: false },
  };
  if (req.query.keyword) {
    keyword = {
      $and: [
        {
          active: { $ne: false },
        },
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
    const count = await Dish.countDocuments({ ...keyword });
    const dishes = await Dish.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ dishes, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    return next(new HttpError("Could not fetch dishes, please try again", 500));
  }
};

const getDishesByLocation = async (req, res, next) => {
  const { lat, long } = req.params;

  if (!lat && !long) {
    return next(new HttpError("Not location provided", 500));
  }

  const pageSize = 15;
  const page = Number(req.query.pageNumber) || 1;
  let keyword = {
    active: { $ne: false },
    loc: {
      $near: {
        $geometry: { type: "Point", coordinates: [long, lat] },
        $maxDistance: 10 * 1000,
      },
    },
  };
  if (req.query.keyword) {
    keyword = {
      $and: [
        {
          active: { $ne: false },
          loc: {
            $near: {
              $geometry: { type: "Point", coordinates: [long, lat] },
              $maxDistance: 8 * 1000,
            },
          },
        },
        {
          $or: [
            {
              name: {
                $regex: req.query.keyword,
                $options: "i",
              },
            },
            {
              category: {
                $regex: req.query.keyword,
                $options: "i",
              },
            },
          ],
        },
      ],
    };
  }
  try {
    const count = await Dish.estimatedDocumentCount({ ...keyword });
    const dishes = await Dish.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ dishes, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not fetch dishes, please try again", 500));
  }
};

const getDishById = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);

    res.json(dish);
  } catch (error) {
    return next(new HttpError("Could not find dish", 500));
  }
};

const updateDish = async (req, res, next) => {
  const { name, image, price, desc, category, lat, long, active } = req.body;
  try {
    const dish = await Dish.findById(req.params.id);

    if (dish) {
      dish.name = name || dish.name;
      dish.image = image || dish.image;
      dish.price = price || dish.price;
      dish.desc = desc || dish.desc;
      dish.category = category || dish.category;
      dish.loc.type = "Point";
      dish.loc.coordinates = [dish.loc.coordinates[0], lat];
      dish.loc.coordinates = [long, dish.loc.coordinates[1]];

      if (active) {
        dish.active = active == 1 ? true : false;
      }

      const updatedish = await dish.save();

      res.status(201).json(updatedish);
    } else {
      return next(new HttpError("Could not find dish", 500));
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not update dish", 500));
  }
};

const deleteDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (dish) {
      await dish.remove();

      res.status(200).json({ message: "dish removed" });
    } else {
      return next(new HttpError("Could not find dish", 500));
    }
  } catch (error) {
    return next(new HttpError("Could not delete dish", 500));
  }
};

module.exports = {
  addNewDish,
  getDishes,
  getDishesByLocation,
  getDishById,
  updateDish,
  deleteDish,
};
