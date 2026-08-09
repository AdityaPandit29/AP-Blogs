import express from "express";
import pg from "pg";
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// const db = new pg.Client({ user: "postgres", host: "localhost", database: "apblogs", password: "adipan123", port: 5432, });

async function ensureTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id int PRIMARY KEY,
      username varchar(50) UNIQUE NOT NULL,
      pass varchar(255) NOT NULL,
      nickname varchar(50) NOT NULL
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      user_id int REFERENCES users (user_id),
      title varchar(100) NOT NULL,
      description text,
      content text,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Database tables ready");
}

db.connect()
  .then(() => {
    console.log("Connected to Render Postgres");
    return ensureTables();
  })
  .catch(err => console.error("DB connection error:", err));

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { user_id: payload.user_id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
}

app.post("/api/register", async (req, res) => {
  const { username, pass, nickname } = req.body;
  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM USERS"
    );
    const user_id = parseInt(result.rows[0].count) + 1;
    
    await db.query(
      "INSERT INTO users VALUES ($1, $2, $3, $4)",
      [user_id, username, pass, nickname]
    );
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    if (err.code === "23505") {
      console.log("Username already exists.");
      return res.status(409).json({ message: "Username already exists." });
    }
    res.status(500).json({ message: "Error registering user", error: err });
  }
});


app.post("/api/login", async (req, res) => {
  const { username, pass } = req.body;
  try {
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
    const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message : "Login successful", token });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const {username, nickname} = (await db.query(
      "SELECT username, nickname FROM USERS WHERE user_id = $1", [user_id]
    )).rows[0];

    const posts = (await db.query(
      "SELECT * FROM BLOGS WHERE user_id = $1 ORDER BY updated_at DESC", [user_id]
    )).rows;

    res.json({username: username, nickname: nickname, posts: posts});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post('/api/create', authenticateToken, async (req, res) => {
  const { title, description, content } = req.body;
  const user_id = req.user.user_id;
  
  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }
    
    await db.query(
      "INSERT INTO BLOGS (user_id, title, description, content, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())",
      [user_id, title, description || null, content]
    );
    
    res.status(201).json({ 
      message: 'Blog post created successfully!',
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating blog post' });
  }
});


app.post('/api/edit', authenticateToken, async (req, res) => {
  const { blogId, title, description, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }
    await db.query(
      "UPDATE BLOGS SET title = $1, description = $2, content = $3, updated_at = NOW() WHERE id = $4",
      [title, description || null, content, blogId]
    );
    
    res.status(201).json({ 
      message: 'Blog post updated successfully!',
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating blog post' });
  }
});


app.get('/api/logout', (_req, res) => {
  res.json({ message: 'Logout successful' });
});


app.post('/api/delete', authenticateToken, async (req, res) => {
  const blog_id = req.body.postId;

  try{
    await db.query(
      'DELETE FROM BLOGS WHERE id = $1', [blog_id]
    );

    res.status(201).json({message : "Blog deleted successfully"})
  }
  catch(err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
