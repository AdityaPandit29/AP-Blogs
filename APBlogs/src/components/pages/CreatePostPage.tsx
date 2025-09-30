import React, { useState } from 'react';
import NavBar from '../NavBar.tsx';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { useUser } from '../UserContext.tsx'

interface CreatePostPageProps {
  setUser: (user: any) => void;
}

export default function CreatePostPage({setUser} : CreatePostPageProps) {
  // const { setUser } = useUser();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: ''
  });
  const [error, setError] = useState('');
  // const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    // setSuccess(false);

    if (!form.title || !form.content) {
      setError('Title and Content are required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
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
        const res = await fetch('http://localhost:3000/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);  // e.g. { username, nickname, avatarUrl, posts }
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      }
      navigate('/profile');

    } catch (err) {
      setError('Unexpected error occurred.');
    }

    // setSuccess(true);
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
            Create New Blog
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

          {/* {success && (
            <Typography color="success.main" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
              Post created successfully!
            </Typography>
          )} */}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 3 }}
          >
            Create
          </Button>
          <Button
              variant="outlined"
              color="secondary"
              href='/profile'
              sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', borderRadius: 3 }}
            >
              Cancel
            </Button>
        </Paper>
      </Box>
    </>
  );
}
