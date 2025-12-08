import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Usuario actual
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Error leyendo usuario de localStorage", err);
      }
    }

    // Pedidos del usuario (historial local, placeholder de Big Data)
    try {
      let userKey = "guest";
      if (stored) {
        const u = JSON.parse(stored);
        userKey = u._id || u.id || u.email || "guest";
      }
      const rawOrders = localStorage.getItem(`orders_${userKey}`);
      const parsed = rawOrders ? JSON.parse(rawOrders) : [];
      setOrders(parsed);
    } catch (err) {
      console.error("Error leyendo pedidos de localStorage", err);
    }
  }, []);

  const totalOrders = orders.length;

  const totalItems = orders.reduce((sum, order) => {
    const count = order.items?.reduce(
      (acc, it) => acc + (it.quantity || 0),
      0
    );
    return sum + (count || 0);
  }, 0);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value ?? 0);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Bienvenido a SurtiMovil</h1>
          <p className="page-subtitle">
            Panel general de tu actividad. Más adelante aquí se integrarán
            métricas de Big Data del proyecto.
          </p>
        </div>
      </header>

      {/* Info de usuario */}
      {user && (
        <div className="state-box">
          <p>
            <strong>Usuario:</strong>{" "}
            {user.name || user.nombre || user.email}
          </p>
          {user.email && (
            <p>
              <strong>Correo:</strong> {user.email}
            </p>
          )}
        </div>
      )}

      {/* Dashboard / Reportes (placeholder) */}
      <section className="reports-grid">
        <div className="report-card">
          <h3>Pedidos realizados (local)</h3>
          <p className="report-value">{totalOrders}</p>
        </div>

        <div className="report-card">
          <h3>Productos totales en pedidos</h3>
          <p className="report-value">{totalItems}</p>
        </div>

        <div className="report-card">
          <h3>Ingresos estimados</h3>
          <p className="report-value">{formatCurrency(totalRevenue)}</p>
        </div>

        <div className="report-card">
          <h3>Métrica Big Data</h3>
          <p className="report-value">Placeholder</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            Aquí se mostrarán métricas calculadas con técnicas de Big Data.
          </p>
        </div>
      </section>

      {/* Mensaje si aún no hay pedidos */}
      {!orders.length && (
        <div className="state-box">
          <p>
            Aún no has generado pedidos en este dispositivo. Haz un pedido
            desde el carrito para ver datos aquí.
          </p>
        </div>
      )}
    </section>
  );
}
