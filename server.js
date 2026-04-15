import app from "./src/app.js";

const PORT = 3000;

app.get("/", (req, res) => {
  res.json("App Working");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
