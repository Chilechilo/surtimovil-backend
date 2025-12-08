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

      const contentType = resp.headers.get("content-type") || "";
      let data;

      if (contentType.includes("application/json")) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        throw new Error(
          `Respuesta no válida del servidor (${resp.status}): ${text.slice(
            0,
            80
          )}...`
        );
      }

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

      {/* Carrito vacío */}
      {!items.length && (
        <div className="state-box">
          <p>Tu carrito está vacío.</p>
        </div>
      )}

      {/* Carrito con items */}
      {items.length > 0 && (
        <div className="state-box">
          <ul className="cart-list">
            {items.map((item) => {
              const price = Number(item.price || 0);
              const qty = Number(item.quantity || 0);
              const subtotal = price * qty;

              return (
                <li key={item.id} className="cart-item">
                  <div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">
                      Cantidad: {qty} · Precio: ${price.toFixed(2)}
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-subtotal">
                      {subtotal.toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="cart-summary">
            <div className="cart-total">
              Total: <strong>${numericTotal.toFixed(2)}</strong>
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
