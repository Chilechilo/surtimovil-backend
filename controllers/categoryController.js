import Category from "../models/Category.js";

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ id: 1 });

    if (!categories.length) {
      return res.status(404).json({ success: false, message: "No categories found" });
    }

    res.json({ success: true, categories });

  } catch (err) {
    res.status(500).json({ success: false, message: "Unexpected server error" });
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Category ID must be a number" });
    }

    const category = await Category.findOne({ id: Number(id) });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, category });

  } catch (err) {
    res.status(500).json({ success: false, message: "Unexpected server error" });
  }
};

// GET /api/categories/name/:categoryName
export const getCategoryByName = async (req, res) => {
  try {
    const { categoryName } = req.params;

    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const category = await Category.findOne({ category: categoryName });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, category });

  } catch (err) {
    res.status(500).json({ success: false, message: "Unexpected server error" });
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, category, categoryName } = req.body;

    const finalName = (name || category || categoryName || "").trim();

    if (!finalName) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    // Ver si ya existe
    const existing = await Category.findOne({ category: finalName });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    // Sacar el último id para continuar la secuencia
    const last = await Category.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const newCategory = await Category.create({
      id: nextId,
      category: finalName,
    });

    return res.status(201).json({
      success: true,
      category: newCategory,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Unexpected server error" });
  }
};
