import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "La categoría es obligatoria"],
    minlength: [3, "La categoría debe tener mínimo 3 caracteres"],
    maxlength: [30, "La categoría no debe exceder 30 caracteres"]
  },

  id: {
    type: Number,
    required: [true, "El id es obligatorio"],
    min: [1, "El id no puede ser menor que 1"]
  },

  name: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"],
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [60, "El nombre no puede exceder 60 caracteres"]
  },

  price: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [1, "El precio mínimo permitido es 1"],
    max: [999999, "El precio supera el límite permitido"]
  },

  image: {
    type: String,
    required: [true, "La imagen es obligatoria"],
    match: [
      /^https?:\/\/.+/,
      "La URL de la imagen debe ser válida"
    ]
  }
});

export default mongoose.model("Product", productSchema);
