import express from "express";
import { 
  getAllProducts,
  getProductsByCategory,
  getProductByCategoryAndId,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/category/:category/:id", getProductByCategoryAndId);

// ADMIN ONLY
router.post("/", verifyToken, verifyAdminOnly, createProduct);
router.put("/:id", verifyToken, verifyAdminOnly, updateProduct);
router.delete("/:id", verifyToken, verifyAdminOnly, deleteProduct);

export default router;
