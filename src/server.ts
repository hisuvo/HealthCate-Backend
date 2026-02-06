import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const bootstrap = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

bootstrap();
