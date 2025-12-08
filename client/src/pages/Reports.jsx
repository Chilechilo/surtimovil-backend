import { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        // Intento 1: /api/reports/summary
        let resp = await fetch(`${API_BASE}/reports/summary`);
        if (!resp.ok) {
          // Intento 2: /api/reports
          resp = await fetch(`${API_BASE}/reports`);
        }

        if (!resp.ok) {
          throw new Error("No se pudieron cargar los reportes");
        }

        const json = await resp.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al obtener reportes");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value ?? 0);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Reportes</h1>
          <p className="page-subtitle">
            Resumen general de la actividad en SurtiMovil.
          </p>
        </div>
      </header>

      {loading && (
        <div className="state-box">
          <p>Cargando reportes...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box state-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Tarjetas de métricas principales */}
          <div className="reports-grid">
            {"totalUsers" in data && (
              <div className="report-card">
                <h3>Usuarios registrados</h3>
                <p className="report-value">{data.totalUsers}</p>
              </div>
            )}

            {"totalOrders" in data && (
              <div className="report-card">
                <h3>Pedidos realizados</h3>
                <p className="report-value">{data.totalOrders}</p>
              </div>
            )}

            {"totalProducts" in data && (
              <div className="report-card">
                <h3>Productos activos</h3>
                <p className="report-value">{data.totalProducts}</p>
              </div>
            )}

            {"totalRevenue" in data && (
              <div className="report-card">
                <h3>Ingresos generados</h3>
                <p className="report-value">
                  {formatCurrency(data.totalRevenue)}
                </p>
              </div>
            )}
          </div>

          {/* Tabla de top productos si viene en el JSON */}
          {Array.isArray(data.topProducts) && data.topProducts.length > 0 && (
            <section className="reports-table-section">
              <h2>Productos más vendidos</h2>
              <div className="reports-table-wrapper">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Veces vendido</th>
                      <th>Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((p) => (
                      <tr key={p.productId || p.id || p.name}>
                        <td>{p.name}</td>
                        <td>{p.count}</td>
                        <td>{formatCurrency(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}

      {/* Si no hay datos pero tampoco error */}
      {!loading && !error && !data && (
        <div className="state-box">
          <p>No se recibieron datos de reportes.</p>
        </div>
      )}
    </section>
  );
}
