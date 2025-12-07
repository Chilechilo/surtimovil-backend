import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "El nombre de la categoría es obligatorio"],
    minlength: [3, "La categoría debe tener mínimo 3 caracteres"],
    maxlength: [40, "La categoría no debe exceder 40 caracteres"]
  }
});

export default mongoose.model("Category", categorySchema);
