import { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";

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

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      setError("Debes iniciar sesión para ver tus pedidos.");
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const resp = await fetch(`${API_BASE}/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await resp.json();

        if (!resp.ok || data.success === false) {
          throw new Error(data.message || "Error al obtener tus pedidos");
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "No se pudieron cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, token]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Mis pedidos</h1>
          <p className="page-subtitle">
            Historial de pedidos realizados con tu cuenta.
          </p>
        </div>
      </header>

      {loading && (
        <div className="state-box">
          <p>Cargando pedidos...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box state-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="state-box">
          <p>No has realizado ningún pedido todavía.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="state-box">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th># Pedido</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Artículos</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o.orderNumber}</td>
                    <td>{statusLabel(o.status)}</td>
                    <td>${o.total?.toFixed?.(2) ?? o.total}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{o.items?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
