import express, { json } from "express";
import { connectDB } from "./db";
import dotenv from "dotenv";
import { router } from "./routes";
import { errorMiddleware } from "./middleware/errorMiddleware";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(json());
app.use("/api", router);
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
