import express from "express";
import pg from "pg";
import cors from 'cors';
import session from 'express-session';

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

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers to control how web applications running on one origin (domain, protocol, or port) can access resources from a different origin.
app.use(express.json()); // parse the json body into object
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',  // used to sign(encrypt) session cookie
  resave: false,              // avoid resaving session if unmodified
  saveUninitialized: false,   // don't save empty sessions
  cookie: { secure: false }   // true if using HTTPS and false if using HTTP
}));

app.post("/api/register", async (req, res) => {
  const { username, pass, nickname } = req.body;
  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM USERS"
    );
    const user_id = parseInt(result.rows[0].count) + 1;
    
    // You can validate inputs here (e.g., uniqueness, etc.)
    await db.query(
      "INSERT INTO users VALUES ($1, $2, $3, $4)",
      [user_id, username, pass, nickname]
    );
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    if (err.code === "23505") { // Unique violation
      console.log("Username already exists.");
      return res.status(409).json({ message: "Username already exists." });
    }
    res.status(500).json({ message: "Error registering user", error: err });
  }
});


app.post("/api/login", async (req, res) => {
  const { username, pass } = req.body;
  try {
    // You can validate inputs here (e.g., uniqueness, etc.)
    const result = await db.query(
      "SELECT * FROM USERS WHERE username = $1",
      [username]
    );

    if(result.rowCount === 0) {
      return res.status(404).json({ message : "Username does not exist." });
    }

    if(pass !== result.rows[0].pass) {
      return res.status(401).json({ message : "Incorrect password." });
    }

    const user_id = result.rows[0].user_id;
    const nickname = result.rows[0].nickname;


    const posts = (await db.query(
      "SELECT * FROM BLOGS WHERE user_id = $1 ORDER BY updated_at DESC", [user_id]
    )).rows;

    req.session.user = {
      username: username,
      nickname: nickname,
      posts: posts
      // any additional info you want to keep
    };

    // res.status(200).json({ 
    //   username : username,
    //   nickname : nickname,
    //   posts : posts
    // });
    // console.log(req.session.user);

    res.status(200).json({ message : "Login successful" });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get('/api/profile', (req, res) => {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
