import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "luisangelhc2004@hotmail.com";
    const newPassword = "Luis2004";

    const hashed = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashed },
      { new: true }
    );

    if (!user) {
      console.log("❌ Usuario no encontrado");
    } else {
      console.log("✅ Contraseña actualizada correctamente:", user.email);
    }

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetPassword();
