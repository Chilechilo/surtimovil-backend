import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Error leyendo usuario de localStorage", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <section className="page">
        <header className="page-header">
          <h1>Mi cuenta</h1>
        </header>

        <div className="state-box">
          <p>No se encontraron datos de usuario.</p>
          <button onClick={() => navigate("/login")}>
            Ir a iniciar sesión
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Mi cuenta</h1>
          <p className="page-subtitle">
            Información básica de tu perfil en SurtiMovil.
          </p>
        </div>
      </header>

      <div className="state-box">
        <p>
          <strong>Nombre:</strong>{" "}
          {user.name || user.nombre || "Sin nombre"}
        </p>
        {user.email && (
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
        )}
      </div>

      <div className="state-box">
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </section>
  );
}
