import { useEffect, useState } from "react";
import "./Home.css";

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
    <section className="page home-page">
  <header className="page-header">
    <h1 className="home-title">Bienvenido a SurtiMovil</h1>
    <p className="home-subtitle">Tu sistema de pedidos y catálogo para tiendas.</p>
  </header>

  {user && (
    <div className="home-user-card">
      <p><strong>👤 Nombre:</strong> {user.name || user.nombre}</p>
      <p><strong>📧 Correo:</strong> {user.email}</p>
    </div>
  )}
  </section>
  );
}
