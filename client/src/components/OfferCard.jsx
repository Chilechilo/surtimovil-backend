import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function OfferCard({ product }) {
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
    <div className="offer-card">
      <div className="offer-image-wrapper">
        {image ? (
          <img src={image} alt={name} className="offer-image" />
        ) : (
          <div className="offer-image placeholder">Sin imagen</div>
        )}
      </div>

      <div className="offer-info">
        {category && <div className="offer-category">{category}</div>}

        <div className="offer-name" title={name}>
          {name}
        </div>

        <div className="offer-bottom">
          <span className="offer-price">{formatPrice(price)}</span>
          <button
            type="button"
            className="offer-add-btn"
            onClick={handleAdd}
          >
            {added ? "✓ Agregado" : "🛒 Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
