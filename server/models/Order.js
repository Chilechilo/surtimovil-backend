import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Usuario dueño del pedido
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Número incremental para mostrar Pedido #1, #2...
    orderNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    // Items del pedido
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Order must have at least one item",
      },
    },

    // Total
    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // Estado (en inglés)
    status: {
      type: String,
      enum: ["pending", "delivered", "canceled"],
      default: "pending",
    },

    // Datos para QR
    qrCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    qrRedeemed: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// índices útiles
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
