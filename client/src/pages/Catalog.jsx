import { useEffect, useState } from "react";
import "./Products.css";
import { API_BASE } from "../apiConfig";
import ProductCard from "../components/ProductCard";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Categorías
        try {
          const resCat = await fetch(`${API_BASE}/categories`);
          const dataCat = await resCat.json();

          if (resCat.ok) {
            const listCat = Array.isArray(dataCat)
              ? dataCat
              : dataCat.categories || [];
            setCategories(listCat);
          } else {
            console.warn("No se pudieron cargar categorías:", dataCat);
          }
        } catch (e) {
          console.warn("Error cargando categorías:", e);
        }

        // Productos
        const resProd = await fetch(`${API_BASE}/products`);
        const dataProd = await resProd.json();

        if (!resProd.ok) {
          throw new Error(
            dataProd.message || "No se pudieron cargar los productos"
          );
        }

        const listProd = Array.isArray(dataProd)
          ? dataProd
          : dataProd.products || [];
        setProducts(listProd);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const name = (p.name || p.nombre || "").toString().toLowerCase();
    const categoryName =
      (p.category || p.categoria || "").toString().toLowerCase();
    const searchText = search.toLowerCase();

    const matchSearch = name.includes(searchText);
    const matchCategory =
      selectedCategory === "Todas" ||
      categoryName === selectedCategory.toLowerCase();

    return matchSearch && matchCategory;
  });

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Catálogo de productos</h1>
          <p className="page-subtitle">
            Explora los productos disponibles en SurtiMovil
          </p>
        </div>

        <div className="page-header-actions">
          <select
            className="catalog-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categories.map((c) => {
              const label =
                c.category || c.categoria || c.name || c.categoryName;
              return (
                <option key={c._id || label} value={label}>
                  {label}
                </option>
              );
            })}
          </select>

          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="catalog-search"
          />
        </div>
      </header>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Cargando productos...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-box state-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="state-box">
          <p>No se encontraron productos con esos filtros</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="products-grid">
          {filtered.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
