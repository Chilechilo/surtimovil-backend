import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const total = items.reduce((sum, item) => {
    const price = item.product.price ?? item.product.precio ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value ?? 0);

  const handleConfirm = () => {
    if (!items.length) return;

    setSending(true);
    setMessage("");

    try {
      const userRaw = localStorage.getItem("user");
      let userKey = "guest";

      if (userRaw) {
        try {
          const u = JSON.parse(userRaw);
          userKey = u._id || u.id || u.email || "guest";
        } catch {
          userKey = "guest";
        }
      }

      // Historial de pedidos local (luego será POST /api/orders)
      const existingRaw = localStorage.getItem(`orders_${userKey}`);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];

      const order = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        total,
        items: items.map((i) => ({
          productId: i.product._id || i.product.id,
          name: i.product.name || i.product.nombre,
          price: i.product.price ?? i.product.precio ?? 0,
          quantity: i.quantity,
        })),
      };

      const updated = [...existing, order];
      localStorage.setItem(`orders_${userKey}`, JSON.stringify(updated));

      clearCart();
      setMessage(
        "Pedido guardado localmente. Más adelante se enviará al servidor."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Carrito</h1>
          <p className="page-subtitle">
            Revisa los productos agregados y confirma tu pedido.
          </p>
        </div>
      </header>

      {!items.length && (
        <div className="state-box">
          <p>Tu carrito está vacío. Agrega productos desde el catálogo u ofertas.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="orders-list">
          {items.map((item) => {
            const p = item.product;
            const name = p.name || p.nombre || "Producto";
            const price = p.price ?? p.precio ?? 0;
            const subtotal = price * item.quantity;

            return (
              <div key={item.id} className="orders-item">
                <div className="orders-item-main">
                  <div className="orders-item-name">{name}</div>
                  <div className="orders-item-price">
                    Precio: {formatCurrency(price)}
                  </div>
                  <div className="orders-item-subtotal">
                    Subtotal: {formatCurrency(subtotal)}
                  </div>
                </div>

                <div className="orders-item-actions">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.id,
                        parseInt(e.target.value, 10) || 1
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="orders-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="state-box">
          <p>
            <strong>Total:</strong> {formatCurrency(total)}
          </p>

          <div className="orders-actions">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={sending}
            >
              {sending ? "Enviando pedido..." : "Finalizar pedido"}
            </button>

            <button
              type="button"
              onClick={clearCart}
              disabled={sending}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="state-box">
          <p>{message}</p>
        </div>
      )}
    </section>
  );
}
