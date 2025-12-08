import express from "express";
import { 
  getAllCategories, 
  getCategoryById,
  getCategoryByName,
  createCategory
} from "../controllers/categoryController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/name/:categoryName", getCategoryByName);

// Rutas sólo admin
router.post("/", verifyToken, verifyAdminOnly, createCategory);

export default router;
