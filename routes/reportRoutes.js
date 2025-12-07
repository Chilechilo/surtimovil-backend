import express from "express";
import { 
  productsByCategory,
  avgPriceByCategory,
  expandedProducts
} from "../controllers/reportController.js";

const router = express.Router();

// Aggregation Endpoints
router.get("/products-by-category", productsByCategory);
router.get("/avg-price", avgPriceByCategory);
router.get("/expanded-products", expandedProducts);

export default router;
