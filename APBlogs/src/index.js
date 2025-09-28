import express from "express";
import pg from "pg";
import cors from 'cors';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "apblogs",
  password: "adipan123",
  port: 5432,
});
db.connect();

app.use(cors()); // CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers to control how web applications running on one origin (domain, protocol, or port) can access resources from a different origin.
app.use(express.json()); // parse the json body into object
app.use(express.urlencoded({ extended: true }));

app.post("/api/register", async (req, res) => {
  const { username, pass, nickname } = req.body;
  try {
    // You can validate inputs here (e.g., uniqueness, etc.)
    await db.query(
      "INSERT INTO users (username, pass, nickname) VALUES ($1, $2, $3)",
      [username, pass, nickname]
    );
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.log(err);
    if (err.code === "23505") { // Unique violation
      return res.status(409).json({ message: "Username already exists." });
    }
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
