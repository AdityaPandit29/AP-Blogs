import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import HomePage from './pages/HomePage.tsx';
import CreatePostPage from './pages/CreatePostPage.tsx' 
import EditPostPage from './pages/EditPostPage.tsx';
// import { UserProvider, useUser } from './UserContext.tsx';

function App() {
  interface Post {
    id: string;
    title: string;
    description?: string; // ? means optional
    content: string;
    updated_at: string;
  }
  interface UserType {
    username: string;
    nickname: string;
    avatarUrl?: string;
    posts: Post[];
  }
  const [user, setUser] = useState<UserType | null>(null);  // Will hold user info & posts

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('https://ap-blogs-react-postgresql.onrender.com/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);  // e.g. { username, nickname, avatarUrl, posts }
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    }
    fetchProfile();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setUser={setUser}/>} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={user ? <CreatePostPage setUser={setUser} /> : <LoginPage  setUser={setUser} />} />
        <Route path="/edit" element={user ? <EditPostPage setUser={setUser} /> : <LoginPage  setUser={setUser} />} />
        <Route path="/profile" element={user ? <ProfilePage {...user} setUser={setUser} /> : <LoginPage  setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
