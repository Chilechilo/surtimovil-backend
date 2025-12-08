import { useEffect, useState } from "react";
import "./Products.css";

const API_BASE = "https://surtimovil-backend.onrender.com/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Cargar categorías y productos al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1) Categorías: GET /api/categories
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

        // 2) Productos: GET /api/products
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

  // Filtro combinado: categoría + texto
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
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Catálogo de productos</h1>
          <p className="page-subtitle">
            Explora los productos disponibles en SurtiMovil
          </p>
        </div>

        <div className="page-header-actions">
          {/* Filtro de categoría */}
          <select
            className="catalog-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categories.map((c) => {
              const label = c.category || c.categoria || c.name || c.categoryName;
              return (
                <option key={c._id || label} value={label}>
                  {label}
                </option>
              );
            })}
          </select>

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="catalog-search"
          />
        </div>
      </header>

      {/* Estados de UI */}

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
    </div>
  );
}

// Card reutilizable (similar a Android pero para escritorio)
function ProductCard({ product }) {
  const name = product.name || product.nombre || "Producto";
  const price = product.price ?? product.precio ?? 0;
  const image = product.image || product.imagen;
  const category = product.category || product.categoria;

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  const handleAdd = () => {
    // Más adelante aquí podemos conectar con carrito web
    alert(`"${name}" agregado (demo front)`);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {image ? (
          <img src={image} alt={name} className="product-image" />
        ) : (
          <div className="product-image placeholder">Sin imagen</div>
        )}
      </div>

      <div className="product-info">
        {category && <div className="product-category">{category}</div>}

        <div className="product-name" title={name}>
          {name}
        </div>

        <div className="product-bottom">
          <span className="product-price">{formatPrice(price)}</span>
          <button className="product-add-btn" onClick={handleAdd}>
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}
