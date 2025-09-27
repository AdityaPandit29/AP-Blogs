import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function LandingPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            AP Blogs
          </Typography>

          <Button
            color="inherit"
            sx={{ ml: 2, borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
            href="#signin"
          >
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          mt: '64px', // height of the fixed AppBar
          p: 4,
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to AP Blogs
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mb: 4, color: 'text.secondary' }}>
          Discover engaging articles, tutorials, and insights from our vibrant tech community.
        </Typography>
        <Button variant="contained" size="large" href="#getstarted" sx={{ borderRadius: 3 }}>
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
