import { useEffect, useState } from "react";
import "./Offers.css";
import ProductCard from "../components/ProductCard";
import { API_BASE } from "../apiConfig";

function Offers() {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOffers() {
      try {
        setLoading(true);
        setError("");

        const resp = await fetch(`${API_BASE}/products`);
        if (!resp.ok) {
          throw new Error("No se pudieron cargar las ofertas");
        }

        const data = await resp.json();

        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);

        const sorted = [...list].sort(
          (a, b) => (a.price ?? 0) - (b.price ?? 0)
        );
        setOffers(sorted.slice(0, 8));
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al obtener las ofertas");
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  return (
    <section className="offers-page">
      <header className="offers-header">
        <h1>Ofertas</h1>
        <p>Los mejores precios seleccionados para tu tienda.</p>
      </header>

      {loading && <div className="offers-state">Cargando ofertas...</div>}

      {!loading && error && <div className="offers-error">{error}</div>}

      {!loading && !error && (
        <>
          <section className="offers-highlight">
            <h2>Ofertas destacadas</h2>
            <div className="offers-grid">
              {offers.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          </section>

          <section className="offers-all">
            <h2>Todos los productos</h2>
            <div className="offers-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default Offers;
