import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Alert from "@mui/material/Alert";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export default function RegisterForm() {
  const [isRegistered, setRegistered] = useState(false);
  const [form, setForm] = useState({ username: '', nickname: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          pass: form.password,
          nickname: form.nickname,
        }),
      });
      const data = await res.json(); // converts the response sent to a JS object
      console.log(res);
      if (!res.ok) {
        setError(data.message);
      } else {
        // setSuccess(data.message);
        setRegistered(true);
      }
    } catch (err) {
      setError('An error occurred while registering.');
    }
  };

  return (
    !isRegistered ? 
    (<form onSubmit={handleSubmit}>
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
          Create an Account
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
        />
        <TextField
          label="Nickname"
          name='nickname'
          value={form.nickname}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
          required
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
          helperText="Must be at least 8 characters."
        />
        <TextField
          label="Confirm Password"
          name='confirmPassword'
          value={form.confirmPassword}
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
          Register
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success" sx={{ mt: 1, fontWeight: 'medium' }}>
            {success}
          </Typography>
        )}

        <Typography sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href="/login" underline="hover" sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
    </form>)
     : 
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
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon fontSize="inherit" />} 
          sx={{ width: '100%', mb: 3, fontWeight: "bold", fontSize: "1.1rem" }}
        >
          Account Created Successfully!
        </Alert>

        <Typography sx={{ mt: 2 }}>
          You can now{' '}
          <Link href="/login" underline="hover" sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
            Login
          </Link>
          {' '}with your new account.
        </Typography>
      </Paper>
    </Box>
  );
}
