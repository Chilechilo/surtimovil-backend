import Order from "../models/Order.js";
import Product from "../models/Product.js";
import crypto from "crypto";

const handleError = (res, err) => {
  console.error("🔥 [orderController] Error:", err);
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: err.message,
  });
};

const generateQrCodeValue = () => crypto.randomBytes(8).toString("hex");

// Helper para obtener el id del usuario desde el request
const getUserIdFromReq = (req) =>
  req.userId ||
  req.user?._id ||
  req.user?.id ||
  req.user?.userId ||
  null;

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must have at least one item" });
    }

    const itemsWithData = [];
    let total = 0;

    for (const item of items) {
      let product = null;

      // 1️⃣ Primero intentar como ObjectId
      if (typeof item.productId === "string" && item.productId.length > 10) {
        product = await Product.findById(item.productId);
      }

      // 2️⃣ Si no, intentar como id numérico
      if (!product && !isNaN(Number(item.productId))) {
        product = await Product.findOne({ id: Number(item.productId) });
      }

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      const quantity = Number(item.quantity) || 1;
      const price = Number(product.price);
      const subtotal = quantity * price;

      itemsWithData.push({
        productId: product.id,
        name: product.name,
        price,
        quantity,
        subtotal,
      });

      total += subtotal;
    }

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const nextOrder = lastOrder ? lastOrder.orderNumber + 1 : 1;

    const newOrder = await Order.create({
      user: userId,
      orderNumber: nextOrder,
      items: itemsWithData,
      total,
      status: "pending",
      qrCode: crypto.randomBytes(8).toString("hex"),
      qrRedeemed: false,
    });

    return res.status(201).json({ success: true, order: newOrder });

  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET /api/orders/my  (pedidos del usuario logueado)
export const getMyOrders = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      orders,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /api/orders  (solo admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /api/orders/:id  (dueño o admin)
export const getOrderById = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { id } = req.params;

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner = userId && order.user._id.toString() === String(userId);
    const isAdmin = req.userRole === "admin" || req.isAdmin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// PATCH /api/orders/:id/status  (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "delivered", "canceled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /api/orders/:id/generate-qr  (admin)
export const generateOrderQrCode = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const qrCode = generateQrCodeValue();
    order.qrCode = qrCode;
    order.qrRedeemed = false;
    await order.save();

    return res.json({
      success: true,
      qrCode,
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /api/orders/scan-qr  (usuario escanea QR)
export const confirmDeliveryByQr = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { qrCode } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!qrCode) {
      return res.status(400).json({
        success: false,
        message: "qrCode is required",
      });
    }

    const order = await Order.findOne({ qrCode });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this QR",
      });
    }

    if (order.user.toString() !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "This QR does not belong to the current user",
      });
    }

    if (order.status === "canceled") {
      return res.status(400).json({
        success: false,
        message: "Order is canceled and cannot be delivered",
      });
    }

    if (order.status === "delivered") {
      return res.json({
        success: true,
        message: "Order already delivered",
        order,
      });
    }

    order.status = "delivered";
    order.qrRedeemed = true;
    order.deliveredAt = new Date();
    await order.save();

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    return handleError(res, err);
  }
};
