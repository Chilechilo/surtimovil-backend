import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE } from "../apiConfig";

export default function Cart() {
  const { items, total, removeFromCart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const handleCreateOrder = async () => {
    setError("");
    setSuccess("");

    if (!user || !token) {
      setError("Debes iniciar sesión para generar un pedido.");
      return;
    }

    if (items.length === 0) {
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
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Carrito</h1>
          <p className="page-subtitle">
            Revisa los productos antes de confirmar tu pedido.
          </p>
        </div>
      </header>

      {items.length === 0 && (
        <div className="state-box">
          <p>Tu carrito está vacío.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="state-box">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">
                    Cantidad: {item.quantity} · Precio: ${item.price}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-subtotal">
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.id)}>
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-total">
              Total: <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              type="button"
              onClick={handleCreateOrder}
              disabled={loading}
            >
              {loading ? "Creando pedido..." : "Finalizar pedido"}
            </button>
          </div>

          {error && (
            <p style={{ color: "#fecaca", marginTop: "0.5rem" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "#bbf7d0", marginTop: "0.5rem" }}>{success}</p>
          )}
        </div>
      )}
    </section>
  );
}
