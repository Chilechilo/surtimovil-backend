import { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import "./Orders.css";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function statusLabel(status) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "delivered":
      return "Entregado";
    case "canceled":
      return "Cancelado";
    default:
      return status;
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!rawUser || !token) {
      setLoading(false);
      setError("Debes iniciar sesión para ver tus pedidos.");
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const resp = await fetch(`${API_BASE}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await resp.text();
        let data = {};

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            throw new Error("Respuesta inesperada del servidor");
          }
        }

        if (!resp.ok || data.success === false) {
          throw new Error(data.message || "Error al obtener tus pedidos");
        }

        if (!cancelled) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrders();
    return () => (cancelled = true);
  }, []);

  return (
    <section className="orders-page">
      <header className="orders-header">
        <h1>Mis pedidos</h1>
        <p>Historial de pedidos realizados con tu cuenta.</p>
      </header>

      {loading && (
        <div className="orders-state">
          <p>Cargando pedidos...</p>
        </div>
      )}

      {!loading && error && (
        <div className="orders-state error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="orders-state">
          <p>No has realizado ningún pedido todavía.</p>
        </div>
      )}

      {/* TARJETAS */}
      <div className="orders-grid">
        {orders.map((o) => (
          <div className="order-card" key={o._id}>
            <div className="order-card-header">
              <span className="order-number">Pedido #{o.orderNumber}</span>
              <span className={`order-status ${o.status}`}>
                {statusLabel(o.status)}
              </span>
            </div>

            <div className="order-info">
              <p>
                <strong>Total:</strong> ${o.total?.toFixed?.(2)}
              </p>
              <p>
                <strong>Fecha:</strong> {formatDate(o.createdAt)}
              </p>
              <p>
                <strong>Artículos:</strong> {o.items?.length || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
