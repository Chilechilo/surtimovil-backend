import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const STORAGE_KEY = "surtimovil_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (err) {
      console.error("Error leyendo carrito de localStorage:", err);
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Error guardando carrito en localStorage:", err);
    }
  }, [items]);


  // ➕ Agregar producto al carrito
  const addToCart = (product) => {
    setItems((current) => {
      const id = product.id ?? product._id;
      if (id == null) return current;

      const existing = current.find((it) => it.id === id);

      if (existing) {
        return current.map((it) =>
          it.id === id
            ? { ...it, quantity: (it.quantity || 0) + 1 }
            : it
        );
      }

      return [
        ...current,
        {
          id,
          name: product.name || product.nombre || "Producto",
          price: Number(product.price ?? product.precio ?? 0),
          image: product.image || product.img || "",   // 👈 soporte de imagen
          quantity: 1,
        },
      ];
    });
  };


  // ❌ Quitar producto
  const removeFromCart = (id) => {
    setItems((current) => current.filter((it) => it.id !== id));
  };


  // 🔄 Actualizar cantidad (+ y –)
  const updateQuantity = (id, newQty) => {
    setItems((current) =>
      current
        .map((it) =>
          it.id === id
            ? { ...it, quantity: Math.max(1, newQty) } // evita cero o negativos
            : it
        )
        .filter((it) => it.quantity > 0) // si llega a 0 lo elimina
    );
  };


  // 🧼 Vaciar carrito
  const clearCart = () => setItems([]);


  // 💰 Total
  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );


  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,   // 👈 muy importante
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
