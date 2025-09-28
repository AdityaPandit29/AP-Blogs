import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({username : '', password : ''});
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({...form, [e.target.name] : e.target.value});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          pass: form.password,
        }),
      });

      const data = await res.json(); // converts the response sent to a JS object
      console.log(res);
      console.log(data);
      if(!res.ok) {
        setError(data.message);
      }
      else {
        navigate(`/profile/${form.username}`);
      }


    } catch (err) {
      setError('Unexpected error occured.');
    }

  }   

  return (
    <form onSubmit={handleSubmit}>
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
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
          Welcome Back
        </Typography>
        <TextField
          label="Username"
          name='username'
          value={form.username}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          required
          autoFocus
          autoComplete='off'
        />
        <TextField
          label="Password"
          name='password'
          value={form.password}
          onChange={handleChange}
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1rem', borderRadius: 2 }}
          type="submit"
        >
          Login
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
            {error}
          </Typography>
        )}

        <Typography sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href="/register" underline="hover" sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
    </form>
  );
}
