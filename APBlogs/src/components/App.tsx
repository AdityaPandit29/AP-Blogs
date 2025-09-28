import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import HomePage from './pages/HomePage.tsx';

function App() {
  const [user, setUser] = useState(null);  // Will hold user info & posts

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('http://localhost:3000/api/profile', { credentials: 'include' });
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/profile/:username" element={user ? <ProfilePage {...user} /> : <LoginPage />} /> */}
        <Route path="/profile" element={<ProfilePage 
            username= "adityapandit29"
            nickname= "Aditya"
            posts= {[{
              id:"1",
              title:"First Blog",
              content:"This is my first blog so Lorem Ipsum",
              updatedAt:"Today",
              description:"First Blog description"
            }]}
        />} />
      </Routes>
    </Router>
  );
}

export default App;
