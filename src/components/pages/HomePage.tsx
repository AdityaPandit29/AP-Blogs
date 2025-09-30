// import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NavBar from '../NavBar.tsx'
import { Link } from "react-router-dom";

interface HomePageProps {
  setUser: (user: any) => void;
}

export default function HomePage({setUser} : HomePageProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <NavBar setUser={setUser}/>
        
      {/* Main Content */}
      <Box
        component="main"
  sx={{
    position: 'relative',
    p: 4,
    minHeight: 'calc(100vh - 64px)',
    backgroundImage: 'url(/home-page-img.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      bgcolor: 'rgba(0, 0, 0, 0.4)',  // Black overlay with 40% opacity
      zIndex: -1,
    },
  }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to AP Blogs
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mb: 4, color: 'white' }}>
          Discover engaging articles, tutorials, and insights from our vibrant tech community.
        </Typography>
        <Button variant="contained" size="large" component={Link} to="/login" sx={{ borderRadius: 3 }}>
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
