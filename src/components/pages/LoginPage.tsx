import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Links from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography} from '@mui/material';
import { Link } from "react-router-dom";
import { apiFetch, setToken } from '../../api.ts';
// import { useUser } from '../UserContext.tsx';

interface LoginPageProps {
  setUser: (user: any) => void;
}

export default function LoginForm({setUser} : LoginPageProps) {
  // const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({username : '', password : ''});
  const [error, setError] = useState('');

  function handleChange(e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({...form, [e.target.name] : e.target.value});
  }

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    
    try {
      const res = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: form.username,
          pass: form.password,
        }),
      });

      const data = await res.json();
      if(!res.ok) {
        setError(data.message);
      }
      else {
        setToken(data.token);

        const profileRes = await apiFetch('/api/profile');

        if (profileRes.ok) {
          const userData = await profileRes.json();
          setUser(userData);
          navigate('/profile');
        } else {
          setError('Failed to load profile');
        }
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
          autoComplete='off'
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
          <Links component={Link} to="/register" underline="hover" sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
            Register
          </Links>
        </Typography>
      </Paper>
    </Box>
    </form>
  );
}
