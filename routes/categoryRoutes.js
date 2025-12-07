import express from "express";
import { 
    getAllCategories, 
    getCategoryById,
    getCategoryByName } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/name/:categoryName", getCategoryByName);

export default router;
