import React, { useState } from 'react';
// import NavBar from '../NavBar.tsx';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
// import { useUser } from '../UserContext.tsx'

interface EditPostPageProps {
  setUser: (user: any) => void;
}

export default function EditPostPage({setUser} : EditPostPageProps) {
  // const { setUser } = useUser();
  const { state } = useLocation();
  const navigate = useNavigate();
  const post = state?.post;

  // Optional guard: if user lands here without state, redirect
  useEffect(() => {
    if (!post) navigate('/', { replace: true });
  }, [post, navigate]);

  if (!post) return null;            // or a spinner


  const [form, setForm] = useState({
    blogId: post.id,
    title: post.title,
    description: post.description,
    content: post.content
  });

  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!form.title || !form.content) {
      setError('Title and Content are required.');
      return;
    }

    try {
      const res = await fetch('https://ap-blogs-react-postgresql.onrender.com/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          blogId: form.blogId,
          title: form.title,
          description: form.description,
          content: form.content
        }),
      });

      const data = await res.json();

      if(!res.ok) {
        setError(data.message);
        return;
      }

      try {
        const res = await fetch('https://ap-blogs-react-postgresql.onrender.com/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      }
      navigate('/profile');

    } catch (err) {
      setError('Unexpected error occurred.');
    }

  }

  return (
    <>
      {/* <NavBar /> */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#545454ff',
          p: 2,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 5,
            borderRadius: 4,
            width: '100%',
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: 'white',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Edit Your Blog
          </Typography>

          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />

          <TextField
            label="Description (optional)"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />

          <TextField
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
            required
            variant="outlined"
          />

          {error && (
            <Typography color="error" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 3 }}
          >
            Update
          </Button>
          <Button
              variant="outlined"
              color="secondary"
              component={Link}
              to='/profile'
              sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 3 }}
            >
              Cancel
            </Button>
        </Paper>
      </Box>
    </>
  );
}
