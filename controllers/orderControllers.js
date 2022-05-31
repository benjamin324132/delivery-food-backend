const Order = require("../models/order");
const User = require("../models/user");
const Dish = require("../models/dish");
const HttpError = require("../middleware/errorMiddleware");

const addNewOrder = async (req, res, next) => {
  const { dishes, deliveryAdress, lat, long } = req.body;

  if (dishes.length === 0) {
    return next(new HttpError("Empty order, add dishes to your cart", 500));
  }

  try {
    const user = await User.findById(req.user);

    if (!user.active) {
      return next(new HttpError("Error user blocked", 500));
    }

    const list = await Promise.all(
      dishes.map(async (dish) => {
        const item = await Dish.findById(dish.dishId);

        const formatedDish = {
          name: item.name,
          qty: dish.qty,
          image: item.image,
          coments: dish.coments,
          price: item.price,
          dishId: item._id,
        };

        return formatedDish;
      })
    );
    //console.log(list);
    const subtotal = list.reduce(function (acc, obj) {
      return acc + obj.price * obj.qty;
    }, 0);
    const total = subtotal + 30;
    const newOrder = await new Order({
      userId: req.user,
      userName: user.name,
      dishes,
      subtotal,
      total,
      deliveryAdress,
      deliveryLocation: {
        lat,
        long,
      },
    });

    const createdOrder = await newOrder.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    return next(new HttpError("Could not add order, please try again", 500));
  }
};

const getOrders = async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  let keyword = {};
  if (req.query.keyword) {
    keyword = {
      $or: [
        {
          userName: {
            $regex: req.query.keyword,
            $options: "i",
          },
        },
        {
          deliveryAdress: {
            $regex: req.query.keyword,
            $options: "i",
          },
        },
      ],
    };
  }
  try {
    const count = await Order.countDocuments({ ...keyword });
    const orders = await Order.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    return next(new HttpError("Could not fetch orders, please try again", 500));
  }
};

const getUserOrders = async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const count = await Order.countDocuments({ userId: req.user });
    const orders = await Order.find({ userId: req.user })
      .sort({ createdAt: -1  })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    return next(new HttpError("Could not fetch orders, please try again", 500));
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    res.json(order);
  } catch (error) {
    return next(new HttpError("Could not fetch order, please try again", 400));
  }
};

const updateOrder = async (req, res, next) => {};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.remove();

      res.status(200).json({ message: "order removed" });
    } else {
      return next(new HttpError("Could not find order", 500));
    }
  } catch (error) {
    return next(new HttpError("Could not delete order", 500));
  }
};

module.exports = {
  addNewOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
