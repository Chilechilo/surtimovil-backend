import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "./Navbar.css";


function getCurrentUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isAdminUser(user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.isAdmin === true) return true;
  return false;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const user = getCurrentUser();
  const isAdmin = isAdminUser(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearCart();
    navigate("/login");
  };

  return (
    <header className="sm-header">
      <div className="sm-header-left">
        <span className="sm-logo">SurtiMovil</span>
      </div>

      <nav className="sm-nav">
        <Link className={isActive("/home") ? "active" : ""} to="/home">
          Inicio
        </Link>

        <Link className={isActive("/offers") ? "active" : ""} to="/offers">
          Ofertas
        </Link>

        <Link className={isActive("/catalog") ? "active" : ""} to="/catalog">
          Catálogo
        </Link>

        {/* Carrito (siempre visible) */}
        <Link className={isActive("/cart") ? "active" : ""} to="/cart">
          Carrito
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {/* Pedidos + Mi cuenta (sólo logueado) */}
        {isLoggedIn && (
          <>
            <Link
              className={isActive("/orders") ? "active" : ""}
              to="/orders"
            >
              Pedidos
            </Link>

            <Link
              className={isActive("/profile") ? "active" : ""}
              to="/profile"
            >
              Mi cuenta
            </Link>
          </>
        )}

        {/* Link de Admin sólo si es admin */}
        {isLoggedIn && isAdmin && (
          <Link className={isActive("/admin") ? "active" : ""} to="/admin">
            Admin
          </Link>
        )}

        {/* Login / Registro / Cerrar sesión */}
        {isLoggedIn ? (
          <button
            type="button"
            className="nav-logout"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        ) : (
          <>
            <Link className={isActive("/login") ? "active" : ""} to="/login">
              Login
            </Link>

            <Link
              className={isActive("/register") ? "active" : ""}
              to="/register"
            >
              Registro
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
