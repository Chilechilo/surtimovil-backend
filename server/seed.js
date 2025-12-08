// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const categories = [
  { id: 1, category: "Electronics" },
  { id: 2, category: "Drinks" },
  { id: 3, category: "Snacks" },
  { id: 4, category: "Cleaning" },
  { id: 5, category: "Personal Care" }
];

const products = [
  {
    "category": "Electronics",
    "id": 1,
    "name": "Audífonos Bluetooth",
    "price": 499.99,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316204/Aud%C3%ADfonos_Bluetooth_dgvvow.jpg"
  },
  {
    "category": "Electronics",
    "id": 2,
    "name": "Cargador tipo C",
    "price": 599.99,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316290/Cargador_tipo_C_crvu6k.jpg"
  },
  {
    "category": "Electronics",
    "id": 3,
    "name": "Audifonos Alambricos",
    "price": 299.99,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316354/Audifonos_Inalambricos_fmwmkm.webp"
  },
  {
    "category": "Electronics",
    "id": 4,
    "name": "Memoria USB",
    "price": 149.99,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316405/Memoria_USB_alpz1g.webp"
  },
  {
    "category": "Electronics",
    "id": 5,
    "name": "Mouse Inalambrico",
    "price": 499.99,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316469/Mouse_inalambrico_odkheu.jpg"
  },
  {
    "category": "Drinks",
    "id": 1,
    "name": "Coca cola 600ml",
    "price": 18.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758232756/coca_f4bk38.webp"
  },
  {
    "category": "Drinks",
    "id": 2,
    "name": "Agua ciel 600ml",
    "price": 12.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316730/Agua_ciel_600_ml_apgxkb.webp"
  },
  {
    "category": "Drinks",
    "id": 3,
    "name": "jugo del valle 1L",
    "price": 25.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317041/Jugo_durazno_vnqf2w.webp"
  },
  {
    "category": "Drinks",
    "id": 4,
    "name": "Red bull 250ml",
    "price": 35.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317085/Red_bull_250ml_jg4kqu.webp"
  },
  {
    "category": "Drinks",
    "id": 5,
    "name": "Monster 500ml",
    "price": 30.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317132/Monster_500ml_ipxnjz.avif"
  },
  {
    "category": "Snacks",
    "id": 1,
    "name": "Papas Sabritas 150g",
    "price": 22.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317212/Papas_Sabritas_150g_lxtjzb.webp"
  },
  {
    "category": "Snacks",
    "id": 2,
    "name": "Galletas Marías 200g",
    "price": 15.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317265/Galletas_Mar%C3%ADas_200g_n8udjr.webp"
  },
  {
    "category": "Snacks",
    "id": 3,
    "name": "Chocolatina Snickers",
    "price": 18.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317316/Chocolatina_Snickers_p0oqab.webp"
  },
  {
    "category": "Snacks",
    "id": 4,
    "name": "Dulces Vero Mango",
    "price": 10.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317377/Dulces_Vero_Mango_kd0btg.webp"
  },
  {
    "category": "Snacks",
    "id": 5,
    "name": "Palomitas de Maíz 100g",
    "price": 12.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317473/Palomitas_de_Ma%C3%ADz_100g_jlxotm.webp"
  },
  {
    "category": "Cleaning",
    "id": 1,
    "name": "Detergente Ariel 1kg",
    "price": 45.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317556/Detergente_Ariel_1kg_pvlvii.webp"
  },
  {
    "category": "Cleaning",
    "id": 2,
    "name": "Cloro Pinol 1L",
    "price": 30.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317609/Cloro_Pinol_1L_lauzxg.webp"
  },
  {
    "category": "Cleaning",
    "id": 3,
    "name": "Jabón Líquido Axion 500ml",
    "price": 25.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317661/Jab%C3%B3n_L%C3%ADquido_Axion_500ml_eobxdb.webp"
  },
  {
    "category": "Cleaning",
    "id": 4,
    "name": "Suavizante Ensueño 1L",
    "price": 35.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317718/Suavizante_Ensue%C3%B1o_1L_k5mzoe.webp"
  },
  {
    "category": "Cleaning",
    "id": 5,
    "name": "Limpiador Fabuloso Naranja 1L",
    "price": 28.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317760/Limpiador_Fabuloso_1L_yhppsq.webp"
  },
  {
    "category": "Personal Care",
    "id": 1,
    "name": "Jabón Dove 90g",
    "price": 15.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317821/Jab%C3%B3n_Dove_90g_v22sb7.webp"
  },
  {
    "category": "Personal Care",
    "id": 2,
    "name": "Shampoo Sedal 400ml",
    "price": 40.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317864/Shampoo_Sedal_400ml_odovu1.webp"
  },
  {
    "category": "Personal Care",
    "id": 3,
    "name": "Pasta Dental Colgate 100ml",
    "price": 25.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758318106/Pasta_Dental_Colgate_100ml_uswurf.webp"
  },
  {
    "category": "Personal Care",
    "id": 4,
    "name": "Desodorante Rexona 150ml",
    "price": 30.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758318153/Desodorante_Rexona_150ml_uskrj8.webp"
  },
  {
    "category": "Personal Care",
    "id": 5,
    "name": "Cepillo de Dientes Oral-B",
    "price": 20.00,
    "image": "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758318209/Cepillo_de_Dientes_Oral-B_gqvmdx.webp"
  }
];

const users = [
  {
    name: "Admin Master",
    email: "admin@example.com",
    password: "12345",
    role: "admin"
  },
  {
    name: "Super User",
    email: "super@example.com",
    password: "12345",
    role: "superuser"
  },
  {
    name: "User Normal",
    email: "user@example.com",
    password: "12345",
    role: "user"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Limpiar colecciones
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Collections cleared");

    // Insertar categorías
    await Category.insertMany(categories);
    console.log("Categories inserted");

    // Insertar productos
    await Product.insertMany(products);
    console.log("Products inserted");

    // Insertar usuarios con hash
    const hashedUsers = await Promise.all(
      users.map(async (usr) => ({
        ...usr,
        password: await bcrypt.hash(usr.password, 10)
      }))
    );

    await User.insertMany(hashedUsers);
    console.log("Users inserted");

    console.log("SEED COMPLETED SUCCESSFULLY");
    process.exit();

  } catch (err) {
    console.error("SEED ERROR:", err);
    process.exit(1);
  }
};

seedDatabase();
