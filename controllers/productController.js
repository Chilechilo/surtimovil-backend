import Product from "../models/Product.js";

// Función genérica para manejar errores
const handleError = (res, err) => {
  console.error(err);

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.message
    });
  }

  // Error por formato incorrecto en parámetros
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid format in parameter",
      errors: err.message
    });
  }

  // Errores de índice duplicado (rare pero puede pasar)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate key error",
      errors: err.keyValue
    });
  }

  // Error inesperado
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: err.message
  });
};

// GET /api/products (todos)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json({ success: true, products });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/products/category/:category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category }).sort({ id: 1 });

    res.json({ success: true, products });
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/products/category/:category/:id
export const getProductByCategoryAndId = async (req, res) => {
  try {
    const { category, id } = req.params;

    const product = await Product.findOne({
      category,
      id: Number(id)
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, product });

  } catch (err) {
    handleError(res, err);
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { category, name, price, image } = req.body;

    if (!category || !name || price == null) {
      return res.status(400).json({
        success: false,
        message: "Category, name and price are required"
      });
    }

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number"
      });
    }

    // Sacar el último producto para calcular el siguiente id
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    const product = await Product.create({
      id: nextId,
      category,
      name,
      price: priceNumber,
      image
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    handleError(res, err);
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Product.findOneAndUpdate(
      { id: Number(id) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, product: updated });

  } catch (err) {
    handleError(res, err);
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findOneAndDelete({ id: Number(id) });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, message: "Product deleted" });

  } catch (err) {
    handleError(res, err);
  }
};

