// src/components/ProductCard.jsx
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

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
    addItem(product);
    alert(`"${name}" agregado al carrito`);
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
