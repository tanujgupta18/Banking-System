import app from "./src/app.js";
import "dotenv/config";
import dns from "dns";
import connectDB from "./src/config/db.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB();

const PORT = 3000;

app.get("/", (req, res) => {
  res.json("App Working");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
