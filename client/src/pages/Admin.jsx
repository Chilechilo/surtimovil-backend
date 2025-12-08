// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";

export default function Admin() {
  const [user, setUser] = useState(null);

  // Categorías
  const [categoryName, setCategoryName] = useState("");
  const [catMessage, setCatMessage] = useState("");
  const [catError, setCatError] = useState("");

  // Productos (crear)
  const [categories, setCategories] = useState([]);
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodMessage, setProdMessage] = useState("");
  const [prodError, setProdError] = useState("");

  // Productos (lista + editar / eliminar)
  const [products, setProducts] = useState([]);
  const [prodListError, setProdListError] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Edición
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const getToken = () => localStorage.getItem("token") || "";

  const isAdminUser = (u) => {
    if (!u) return false;
    if (u.role === "admin") return true;
    if (u.isAdmin === true) return true;
    return false;
  };

  const loadCategories = async () => {
    try {
      const resp = await fetch(`${API_BASE}/categories`);
      const json = await resp.json();

      const list = Array.isArray(json) ? json : json.categories || [];
      setCategories(list);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setProdListError("");

      const resp = await fetch(`${API_BASE}/products`);
      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        setProdListError(data.message || "Error al cargar productos");
        setProducts([]);
        return;
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setProdListError("No se pudo obtener la lista de productos");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        console.error("Error parseando user:", e);
      }
    }

    loadCategories();
    loadProducts();
  }, []);

  // Productos recientes (mini tabla) -> los 5 ids más altos
  const recentProducts = [...products]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 5);

  // --------- Crear categoría ----------
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatMessage("");
    setCatError("");

    if (!categoryName.trim()) {
      setCatError("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: categoryName.trim(),
          category: categoryName.trim(),
          categoryName: categoryName.trim(),
        }),
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        setCatError(data.message || "Error al crear la categoría");
        return;
      }

      setCatMessage("Categoría creada correctamente");
      setCategoryName("");

      const nueva = data.category || data;
      setCategories((prev) => [...prev, nueva]);
    } catch (err) {
      console.error(err);
      setCatError("No se pudo conectar al servidor");
    }
  };

  // --------- Crear producto ----------
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProdMessage("");
    setProdError("");

    if (!prodName.trim() || !prodPrice || !prodCategory.trim()) {
      setProdError(
        "Nombre, precio y categoría son obligatorios para el producto"
      );
      return;
    }

    const priceNumber = Number(prodPrice);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      setProdError("El precio debe ser un número válido");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: prodName.trim(),
          price: priceNumber,
          category: prodCategory.trim(),
          image: prodImage.trim() || undefined,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        setProdError(data.message || "Error al crear el producto");
        return;
      }

      setProdMessage("Producto creado correctamente");
      setProdName("");
      setProdPrice("");
      setProdCategory("");
      setProdImage("");

      // Recargar lista -> actualiza tabla grande y mini tabla
      loadProducts();
    } catch (err) {
      console.error(err);
      setProdError("No se pudo conectar al servidor");
    }
  };

  // --------- Preparar edición ----------
  const startEditProduct = (p) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditCategory(p.category);
    setEditImage(p.image || "");
    setEditError("");
    setEditMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditCategory("");
    setEditImage("");
    setEditError("");
    setEditMessage("");
  };

  // --------- Guardar edición ----------
  const handleSaveEdit = async (id) => {
    setEditError("");
    setEditMessage("");

    if (!editName.trim() || !editPrice || !editCategory.trim()) {
      setEditError("Nombre, precio y categoría son obligatorios");
      return;
    }

    const priceNumber = Number(editPrice);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      setEditError("El precio debe ser un número válido");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          price: priceNumber,
          category: editCategory.trim(),
          image: editImage.trim() || undefined,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        setEditError(data.message || "Error al actualizar el producto");
        return;
      }

      setEditMessage("Producto actualizado correctamente");
      setEditingId(null);
      loadProducts(); // refresca tablas
    } catch (err) {
      console.error(err);
      setEditError("No se pudo conectar al servidor");
    }
  };

  // --------- Eliminar producto ----------
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el producto con ID ${id}?`
    );
    if (!confirmDelete) return;

    try {
      const resp = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await resp.json();

      if (!resp.ok || data.success === false) {
        alert(data.message || "Error al eliminar el producto");
        return;
      }

      loadProducts(); // refresca tablas
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar al servidor para eliminar");
    }
  };

  // --------- Vista protegida ----------
  if (!isAdminUser(user)) {
    return (
      <section className="page">
        <header className="page-header">
          <h1>Zona administrativa</h1>
        </header>
        <div className="state-box state-error">
          <p>No tienes permisos de administrador para acceder a esta página.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Panel de administrador</h1>
          <p className="page-subtitle">
            Crear, actualizar y eliminar categorías y productos.
          </p>
        </div>
      </header>

      {/* ===== CATEGORÍAS ===== */}
      <div className="state-box">
        <h2 style={{ marginTop: 0 }}>Crear categoría</h2>

        <form onSubmit={handleCreateCategory} className="admin-form">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <button type="submit">Guardar categoría</button>
        </form>

        {catError && (
          <p style={{ color: "#fecaca", marginTop: "0.5rem" }}>{catError}</p>
        )}
        {catMessage && (
          <p style={{ color: "#bbf7d0", marginTop: "0.5rem" }}>
            {catMessage}
          </p>
        )}
      </div>

      {/* ===== CREAR PRODUCTO ===== */}
      <div className="state-box">
        <h2 style={{ marginTop: 0 }}>Crear producto</h2>

        <form onSubmit={handleCreateProduct} className="admin-form">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio (MXN)"
            value={prodPrice}
            onChange={(e) => setProdPrice(e.target.value)}
          />

          <select
            value={prodCategory}
            onChange={(e) => setProdCategory(e.target.value)}
          >
            <option value="">Seleccionar categoría existente</option>
            {categories.map((c) => {
              const label =
                c.category || c.categoria || c.name || c.categoryName;
              const id = c._id || label;
              return (
                <option key={id} value={label}>
                  {label}
                </option>
              );
            })}
          </select>

          <input
            type="text"
            placeholder="o escribir nueva categoría"
            value={prodCategory}
            onChange={(e) => setProdCategory(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL de imagen (opcional)"
            value={prodImage}
            onChange={(e) => setProdImage(e.target.value)}
          />

          <button type="submit">Guardar producto</button>
        </form>

        {prodError && (
          <p style={{ color: "#fecaca", marginTop: "0.5rem" }}>{prodError}</p>
        )}
        {prodMessage && (
          <p style={{ color: "#bbf7d0", marginTop: "0.5rem" }}>
            {prodMessage}
          </p>
        )}
      </div>

      {/* ===== MINI TABLA: PRODUCTOS RECIENTES ===== */}
      <div className="state-box">
        <h2 style={{ marginTop: 0 }}>Últimos productos registrados</h2>

        {recentProducts.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={`recent-${p._id || p.id}`}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== LISTA / EDITAR / BORRAR PRODUCTOS ===== */}
      <div className="state-box">
        <h2 style={{ marginTop: 0 }}>Todos los productos</h2>

        {loadingProducts && <p>Cargando productos...</p>}
        {prodListError && (
          <p style={{ color: "#fecaca" }}>{prodListError}</p>
        )}

        {!loadingProducts && !prodListError && products.length === 0 && (
          <p>No hay productos registrados.</p>
        )}

        {!loadingProducts && !prodListError && products.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id || p.id}>
                    <td>{p.id}</td>

                    {editingId === p.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                          />
                        </td>
                        <td className="admin-actions">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(p.id)}
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                          >
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>${p.price}</td>
                        <td>
                          {p.image ? (
                            <a
                              href={p.image}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Ver
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="admin-actions">
                          <button
                            type="button"
                            onClick={() => startEditProduct(p)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(editError || editMessage) && (
          <p
            style={{
              marginTop: "0.5rem",
              color: editError ? "#fecaca" : "#bbf7d0",
            }}
          >
            {editError || editMessage}
          </p>
        )}
      </div>
    </section>
  );
}
