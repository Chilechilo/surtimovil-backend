import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "El nombre es obligatorio"],
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    maxlength: [50, "El nombre no puede exceder 50 caracteres"]
  },

  email: { 
    type: String, 
    required: [true, "El correo es obligatorio"], 
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "El correo no tiene un formato válido"
    ]
  },

  password: { 
    type: String, 
    required: [true, "La contraseña es obligatoria"],
    minlength: [5, "La contraseña debe tener mínimo 5 caracteres"]
  },

  role: { 
    type: String, 
    enum: {
      values: ["user", "admin", "superuser"],
      message: "El rol debe ser user, admin o superuser"
    },
    default: "user"
  }
});

export default mongoose.model("User", userSchema);
