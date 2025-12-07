import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
mongoose.connection.once("open", async () => {
  console.log("Mongo connected to DB:", mongoose.connection.name);
});
