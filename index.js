const express = require("express");
const app = express();
const port = 3500;

// Middleware
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import routes
const kategoriRouter = require("./routes/kategori");
const penulisRouter = require("./routes/penulis");
const penerbitRouter = require("./routes/penerbit");
const bukuRouter = require("./routes/buku");


// Define routes
app.use("/api/kategori", kategoriRouter);
app.use("/api/penulis", penulisRouter);
app.use("/api/penerbit", penerbitRouter);
app.use("/api/buku", bukuRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
