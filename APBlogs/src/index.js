import express from "express";
import pg from "pg";
import cors from 'cors';

const app = express();
const port = 3000;
const router = express.Router();


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

function isAuthenticated(req, res, next) { // Middleware for authentication (example)
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}


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
      "SELECT * FROM BLOGS WHERE user_id = $1", [user_id]
    )).rows;

    console.log(posts);

    res.status(200).json({ 
      username : username,
      nickname : nickname,
      posts : posts
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// router.get('/api/profile', isAuthenticated, async (req, res) => {
//   try {
//     // Get user info from session
//     const username = req.session.user.username;

//     // Query database for user info and posts
//     // Example: assuming SQL and a "users" table and "blogs" table
//     const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
//     const posts = await db.query('SELECT * FROM blogs WHERE user_id = ?', [user.user_id]);

//     res.json({
//       username: user.username,
//       nickname: user.nickname,
//       avatarUrl: user.avatarUrl,
//       posts: posts
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Error loading profile.' });
//   }
// });

// module.exports = router;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
