import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function start(): Promise<void> {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(
        `Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`,
      );
    });
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
}

void start();