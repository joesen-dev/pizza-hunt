const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// tells Mongoose which database to connect to
mongoose.connect(
  // use the environment variable MONGODB_URI if it exists
  // otherwise use the default database at at mongodb://127.0.0.1:27017/pizza-hunt
  // MongoDB will find and connect to the database if it exists or create the database if it doesn't
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizza-hunt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Use this to log mongo queries being executed!
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on http://localhost:${PORT}`));
