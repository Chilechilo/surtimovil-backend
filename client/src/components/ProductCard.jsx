import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const name = product.name || product.nombre || "Producto";
  const price = Number(product.price ?? product.precio ?? 0);
  const image = product.image || product.imagen;
  const category = product.category || product.categoria;

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(value) || 0);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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

          <button
            type="button"
            className="product-add-btn"
            onClick={handleAdd}
          >
            {added ? "✓ Agregado" : "🛒 Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
