import express from "express";
import pg from "pg";
import cors from 'cors';
import session from 'express-session';

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// const db = new pg.Client({ user: "postgres", host: "localhost", database: "apblogs", password: "adipan123", port: 5432, });

db.connect()
  .then(() => console.log("Connected to Render Postgres"))
  .catch(err => console.error("DB connection error:", err));

const allowedOrigins = [
  "http://localhost:5173",          // local dev
  "https://ap-blogs-react-postgresql-frontend.onrender.com" // deployed frontend
];

// app.use(cors({ origin: allowedOrigins, credentials: true })); // CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers to control how web applications running on one origin (domain, protocol, or port) can access resources from a different origin.

// Update CORS configuration:
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Add trust proxy for production:
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}


app.use(express.json()); // parse the json body into object
app.use(express.urlencoded({ extended: true }));
// app.use(session({
//   secret: 'your-secret-key',  // used to sign(encrypt) session cookie
//   resave: false,              // avoid resaving session if unmodified
//   saveUninitialized: false,   // don't save empty sessions
//   cookie: { secure: true, sameSite: "none" }   // true if using HTTPS and false if using HTTP
// }));

// Update session configuration:
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
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
      user_id: user_id,
      // any additional info you want to keep
    };

    res.status(200).json({ message : "Login successful" });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get('/api/profile', async (req, res) => {
  if (req.session && req.session.user) {
    const user_id = req.session.user.user_id;

    const {username, nickname} = (await db.query(
      "SELECT username, nickname FROM USERS WHERE user_id = $1", [user_id]
    )).rows[0];

    const posts = (await db.query(
      "SELECT * FROM BLOGS WHERE user_id = $1 ORDER BY updated_at DESC", [user_id]
    )).rows;

    res.json({username: username, nickname: nickname, posts: posts});
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


app.post('/api/create', async (req, res) => {
  
  if (req.session && req.session.user) {
    const { title, description, content } = req.body;
    const user_id = req.session.user.user_id;
    
    try {
      // Validate required fields
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
      }
      
      
      // Insert new blog post
      await db.query(
        "INSERT INTO BLOGS (user_id, title, description, content, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())",
        [user_id, title, description || null, content]
      );
      
      res.status(201).json({ 
        message: 'Blog post created successfully!',
        // blog_id: blog_id
      });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating blog post' });
    }
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


app.post('/api/edit', async (req, res) => {
  
  if (req.session && req.session.user) {
    const { blogId, title, description, content } = req.body;

    try {
      // Validate required fields
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
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // clear session cookie (default cookie name)
    res.json({ message: 'Logout successful' });
    // console.log("Logout Successful");
  });
});


app.post('/api/delete', async (req, res) => {
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
