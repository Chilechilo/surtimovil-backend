import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("user");
      let userKey = "guest";

      if (userRaw) {
        const u = JSON.parse(userRaw);
        userKey = u._id || u.id || u.email || "guest";
      }

      const rawOrders = localStorage.getItem(`orders_${userKey}`);
      const parsed = rawOrders ? JSON.parse(rawOrders) : [];
      setOrders(parsed);
    } catch (err) {
      console.error("Error leyendo pedidos de localStorage", err);
    }
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value ?? 0);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Pedidos</h1>
          <p className="page-subtitle">
            Historial de pedidos confirmados desde el carrito.
          </p>
        </div>
      </header>

      {!orders.length && (
        <div className="state-box">
          <p>
            Aún no has realizado pedidos en este dispositivo. Finaliza un
            pedido desde el carrito para verlo aquí.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="orders-history">
          {orders.map((order, index) => {
            const itemsCount = order.items?.reduce(
              (sum, it) => sum + (it.quantity || 0),
              0
            );

            return (
              <div key={order.id} className="orders-history-item">
                <div className="orders-history-header">
                  <div>
                    <div className="orders-history-title">
                      Pedido #{index + 1}
                    </div>
                    <div className="orders-history-date">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  <div className="orders-history-summary">
                    <div>{itemsCount} producto(s)</div>
                    <div>{formatCurrency(order.total)}</div>
                  </div>
                </div>

                {Array.isArray(order.items) && order.items.length > 0 && (
                  <ul className="orders-history-items">
                    {order.items.map((it, i) => (
                      <li key={i}>
                        <span>
                          {it.name} x {it.quantity}
                        </span>
                        <span>{formatCurrency(it.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
