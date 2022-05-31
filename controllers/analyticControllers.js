const Order = require("../models/order");
const User = require("../models/user");
const Dish = require("../models/dish");
const HttpError = require("../middleware/errorMiddleware");

const getAnalytics = async (req, res, next) => {
  const start = new Date();
  const end = new Date(start.getTime() - (7 * 24 * 60 * 60 * 1000));
  console.log(start, end)
  try {
    const ordersByDay = await Order.aggregate([
       /* {
            "$match": {
                "createdAt": { "$gte": end, "$lte": start }
            }
        },*/
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: "%Y-%m-%d",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]).sort({ _id: -1 });

    const totalSalesByDay = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: "%Y-%m-%d",
            },
          },
          total: { $sum: "$total" },
        },
      },
    ]).sort({ _id: -1 });

    const mostOrderedUsers = await Order.aggregate([
      {
        $group: {
          _id: "$userName",
          count: { $sum: 1 },
        },
      },
    ])
      .sort({ count: -1 })
      .limit(5);

    const mostOrderedDishes = await Order.aggregate([
      { $unwind: "$dishes" },
      {
        $group: {
          _id: "$dishes.name",
          count: { $sum: 1 },
        },
      },
    ])
      .sort({ count: -1 })
      .limit(5);

    res.json({
      ordersByDay,
      totalSalesByDay,
      mostOrderedUsers,
      mostOrderedDishes,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not fetch orders, please try again", 500));
  }
};

module.exports = { getAnalytics };
