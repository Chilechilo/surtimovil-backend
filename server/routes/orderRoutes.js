import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  generateOrderQrCode,
  confirmDeliveryByQr,
} from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Usuario: escanear QR y marcar como entregado
router.post("/scan-qr", verifyToken, confirmDeliveryByQr);

// Crear pedido (usuario logueado)
router.post("/", verifyToken, createOrder);

// Pedidos del usuario actual
router.get("/my", verifyToken, getMyOrders);

// Admin: ver todos los pedidos
router.get("/", verifyToken, verifyAdminOnly, getAllOrders);

// Ver un pedido (dueño o admin)
router.get("/:id", verifyToken, getOrderById);

// Admin: actualizar estado
router.patch("/:id/status", verifyToken, verifyAdminOnly, updateOrderStatus);

// Admin: generar / regenerar QR
router.post("/:id/generate-qr", verifyToken, verifyAdminOnly, generateOrderQrCode);

export default router;
