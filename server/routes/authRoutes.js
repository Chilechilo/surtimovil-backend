import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// Rutas reales
router.post("/login", login);

router.post("/register", (req, res, next) => {
  console.log(">>> RUTA /api/auth/register DETECTADA <<<");
  next();
}, register);

export default router;
