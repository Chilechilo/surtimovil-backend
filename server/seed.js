import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();


//CATEGORÍAS

const categories = [
  { id: 1, category: "Electronics" },
  { id: 2, category: "Drinks" },
  { id: 3, category: "Snacks" },
  { id: 4, category: "Cleaning" },
  { id: 5, category: "Personal Care" }
];

//PRODUCTOS
const products = [
  // Electronics
  {
    id: 1,
    category: "Electronics",
    name: "Audífonos Bluetooth",
    price: 499.99,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316204/Aud%C3%ADfonos_Bluetooth_dgvvow.jpg"
  },
  {
    id: 2,
    category: "Electronics",
    name: "Cargador tipo C",
    price: 599.99,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316290/Cargador_tipo_C_crvu6k.jpg"
  },
  {
    id: 3,
    category: "Electronics",
    name: "Audifonos Alambricos",
    price: 299.99,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316354/Audifonos_Inalambricos_fmwmkm.webp"
  },
  {
    id: 4,
    category: "Electronics",
    name: "Memoria USB",
    price: 149.99,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316405/Memoria_USB_alpz1g.webp"
  },
  {
    id: 5,
    category: "Electronics",
    name: "Mouse Inalambrico",
    price: 499.99,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316469/Mouse_inalambrico_odkheu.jpg"
  },

  // Drinks
  {
    id: 6,
    category: "Drinks",
    name: "Coca cola 600ml",
    price: 18.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758232756/coca_f4bk38.webp"
  },
  {
    id: 7,
    category: "Drinks",
    name: "Agua ciel 600ml",
    price: 12.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758316730/Agua_ciel_600_ml_apgxkb.webp"
  },
  {
    id: 8,
    category: "Drinks",
    name: "Jugo Del Valle 1L",
    price: 25.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317041/Jugo_durazno_vnqf2w.webp"
  },
  {
    id: 9,
    category: "Drinks",
    name: "Red Bull 250ml",
    price: 35.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317085/Red_bull_250ml_jg4kqu.webp"
  },
  {
    id: 10,
    category: "Drinks",
    name: "Monster 500ml",
    price: 30.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317132/Monster_500ml_ipxnjz.avif"
  },

  // Snacks
  {
    id: 11,
    category: "Snacks",
    name: "Papas Sabritas 150g",
    price: 22.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317212/Papas_Sabritas_150g_lxtjzb.webp"
  },
  {
    id: 12,
    category: "Snacks",
    name: "Galletas Marías 200g",
    price: 15.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317265/Galletas_Mar%C3%ADas_200g_n8udjr.webp"
  },
  {
    id: 13,
    category: "Snacks",
    name: "Chocolatina Snickers",
    price: 18.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317316/Chocolatina_Snickers_p0oqab.webp"
  },
  {
    id: 14,
    category: "Snacks",
    name: "Dulces Vero Mango",
    price: 10.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317377/Dulces_Vero_Mango_kd0btg.webp"
  },
  {
    id: 15,
    category: "Snacks",
    name: "Palomitas de Maíz 100g",
    price: 12.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317473/Palomitas_de_Ma%C3%ADz_100g_jlxotm.webp"
  },

  // Cleaning
  {
    id: 16,
    category: "Cleaning",
    name: "Detergente Ariel 1kg",
    price: 45.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317556/Detergente_Ariel_1kg_pvlvii.webp"
  },
  {
    id: 17,
    category: "Cleaning",
    name: "Cloro Pinol 1L",
    price: 30.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317609/Cloro_Pinol_1L_lauzxg.webp"
  },
  {
    id: 18,
    category: "Cleaning",
    name: "Jabón Líquido Axion 500ml",
    price: 25.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317661/Jab%C3%B3n_L%C3%ADquido_Axion_500ml_eobxdb.webp"
  },
  {
    id: 19,
    category: "Cleaning",
    name: "Suavizante Ensueño 1L",
    price: 35.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317718/Suavizante_Ensue%C3%B1o_1L_k5mzoe.webp"
  },
  {
    id: 20,
    category: "Cleaning",
    name: "Limpiador Fabuloso Naranja 1L",
    price: 28.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317760/Limpiador_Fabuloso_1L_yhppsq.webp"
  },

  // Personal Care
  {
    id: 21,
    category: "Personal Care",
    name: "Jabón Dove 90g",
    price: 15.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317821/Jab%C3%B3n_Dove_90g_v22sb7.webp"
  },
  {
    id: 22,
    category: "Personal Care",
    name: "Shampoo Sedal 400ml",
    price: 40.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758317864/Shampoo_Sedal_400ml_odovu1.webp"
  },
  {
    id: 23,
    category: "Personal Care",
    name: "Pasta Dental Colgate 100ml",
    price: 25.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758318106/Pasta_Dental_Colgate_100ml_uswurf.webp"
  },
  {
    id: 24,
    category: "Personal Care",
    name: "Desodorante Rexona 150ml",
    price: 30.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758318153/Desodorante_Rexona_150ml_uskrj8.webp"
  },
  {
    id: 25,
    category: "Personal Care",
    name: "Cepillo de Dientes Oral-B",
    price: 20.00,
    image: "https://res.cloudinary.com/dsgzirfyp/image/upload/v1758318209/Cepillo_de_Dientes_Oral-B_gqvmdx.webp"
  }
];

// USUARIOS
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

    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Collections cleared");

    await Category.insertMany(categories);
    console.log("Categories inserted");

    await Product.insertMany(products);
    console.log("Products inserted");

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
