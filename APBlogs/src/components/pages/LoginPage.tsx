import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

export default function LoginForm() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
          variant="outlined"
          fullWidth
          margin="normal"
          required
          autoFocus
        />
        <TextField
          label="Password"
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

        <Typography sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link href="/register" underline="hover" sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
