import Product from "../models/Product.js";
import Category from "../models/Category.js";

// 1) Productos por categoría
export const productsByCategory = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 }
        }
      },
      { $sort: { totalProducts: -1 } }
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Aggregation error" });
  }
};

// 2) Precio promedio por categoría
export const avgPriceByCategory = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          avgPrice: { $avg: "$price" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: "$_id",
          avgPrice: { $round: ["$avgPrice", 2] },
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Aggregation error" });
  }
};

// 3) Productos expandidos con categoría ($lookup)
export const expandedProducts = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "category",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 0,
          name: 1,
          category: 1,
          price: 1,
          image: 1,
          categoryDescription: "$categoryInfo.category",
          categoryId: "$categoryInfo.id"
        }
      }
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Aggregation error" });
  }
};
