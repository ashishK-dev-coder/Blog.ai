import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

dotenv.config({
  path: "../.env",
});

// DB Connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 7777, () => {
      console.log(`⚙️\n Login Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed !!!", err);
  });
