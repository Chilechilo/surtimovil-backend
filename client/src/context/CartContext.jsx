import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

function getUserKey() {
  const stored = localStorage.getItem("user");
  if (!stored) return "guest";

  try {
    const user = JSON.parse(stored);
    return user._id || user.id || user.email || "guest";
  } catch {
    return "guest";
  }
}

export function CartProvider({ children }) {
  const [userKey] = useState(getUserKey);
  const [items, setItems] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`cart_${userKey}`);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (err) {
        console.error("Error leyendo carrito de localStorage", err);
      }
    }
  }, [userKey]);

  // Guardar carrito cuando cambie
  useEffect(() => {
    localStorage.setItem(`cart_${userKey}`, JSON.stringify(items));
  }, [items, userKey]);

  const addItem = (product) => {
    const id = product._id || product.id;
    if (!id) {
      console.warn("Producto sin id, no se puede agregar al carrito", product);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id, quantity: 1, product }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    const safeQty = Math.max(1, quantity || 1);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: safeQty } : i))
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
