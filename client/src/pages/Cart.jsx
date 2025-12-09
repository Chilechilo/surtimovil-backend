import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE } from "../apiConfig";
import "./Cart.css";

export default function Cart() {
  const { items, total, removeFromCart, clearCart, updateQuantity } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const numericTotal = Number(total) || 0;

  const handleCreateOrder = async () => {
    setError("");
    setSuccess("");

    if (!user || !token) {
      setError("Debes iniciar sesión para generar un pedido.");
      return;
    }

    if (!items.length) {
      setError("Tu carrito está vacío.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const resp = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        throw new Error(data.message || "Error al crear el pedido");
      }

      clearCart();
      setSuccess(`Pedido #${data.order.orderNumber} creado correctamente.`);
    } catch (err) {
      console.error(err);
      setError(err.message || "No se pudo crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page cart-page">
      <header className="page-header">
        <h1>Carrito</h1>
        <p>Revisa los productos antes de confirmar tu pedido.</p>
      </header>

      {/* Carrito vacío */}
      {!items.length && (
        <div className="state-box">
          <p>Tu carrito está vacío.</p>
        </div>
      )}

      {/* Carrito con items */}
      {items.length > 0 && (
        <div className="cart-container">
          {items.map((item) => {
            const price = Number(item.price || 0);
            const qty = Number(item.quantity || 0);
            const subtotal = price * qty;

            return (
              <div key={item.id} className="cart-card">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="cart-card-img"
                />

                <div className="cart-card-info">
                  <h3>{item.name}</h3>
                  <p className="cart-card-price">${price.toFixed(2)}</p>

                  <div className="cart-qty-controls">
                    <button onClick={() => updateQuantity(item.id, qty - 1)}>
                      –
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => updateQuantity(item.id, qty + 1)}>
                      +
                    </button>
                  </div>

                  <p className="cart-subtotal">
                    Subtotal: <strong>${subtotal.toFixed(2)}</strong>
                  </p>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            );
          })}

          {/* Totales */}
          <div className="cart-summary">
            <h2>Total</h2>
            <p className="cart-total">${numericTotal.toFixed(2)}</p>

            <button
              className="cart-submit-btn"
              onClick={handleCreateOrder}
              disabled={loading}
            >
              {loading ? "Creando pedido..." : "Finalizar pedido"}
            </button>

            {error && <p className="cart-error">{error}</p>}
            {success && <p className="cart-success">{success}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
