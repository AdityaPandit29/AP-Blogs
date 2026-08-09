import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { apiFetch, clearToken, getToken } from '../api.ts';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

interface ButtonAppBarProps {
  setUser: (user: any) => void;
}

export default function ButtonAppBar({ setUser }: ButtonAppBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isLoggedIn = Boolean(getToken());

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleSignOut() {
    clearToken();
    await apiFetch('/api/logout');
    setUser(null);
    navigate('/');
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <Box sx={{ flexGrow: 1, paddingTop: { xs: '48px', sm: '56px', md: '64px' } }}>
      <AppBar position="fixed">
        <Toolbar sx={{ minHeight: { xs: '48px', sm: '56px', md: '64px' } }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontFamily: 'monospace',
              color: 'inherit',
              flexGrow: 1,
            }}
          >
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              AP Blogs
            </a>
          </Typography>

          {!isHomePage && isLoggedIn && (
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ mr: 1 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Username"
                  inputProps={{ 'aria-label': 'search users' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Search>
            </Box>
          )}

          {!isHomePage && isLoggedIn ? (
            <div>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/profile');
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          ) : (
            !isHomePage && (
              <Button
                color="inherit"
                sx={{ ml: 2, borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
                component={Link}
                to="/login"
              >
                Sign In
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
