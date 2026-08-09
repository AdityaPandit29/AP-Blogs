import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import NavBar from '../NavBar.tsx';
import { apiFetch } from '../../api.ts';

interface SearchResult {
  username: string;
  nickname: string;
}

interface SearchPageProps {
  setUser: (user: any) => void;
}

export default function SearchPage({ setUser }: SearchPageProps) {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q')?.trim() ?? '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function searchUsers() {
      if (!q) {
        setResults([]);
        setError('');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await apiFetch(`/api/users/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) {
          setError('Failed to search users.');
          setResults([]);
          return;
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setError('Unexpected error occurred.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    searchUsers();
  }, [q]);

  return (
    <div>
      <NavBar setUser={setUser} />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#545454ff',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={6} sx={{ width: 800, p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Search users
          </Typography>

          {!q && (
            <Typography color="text.secondary">
              Enter a username or nickname in the search bar above.
            </Typography>
          )}

          {q && (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Results for &quot;{q}&quot;
            </Typography>
          )}

          {loading && <Typography>Searching...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {!loading && !error && q && results.length === 0 && (
            <Typography color="text.secondary">No users found.</Typography>
          )}

          {!loading && results.length > 0 && (
            <List>
              {results.map((user) => (
                <ListItemButton
                  key={user.username}
                  component={Link}
                  to={`/users/${user.username}`}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {user.nickname[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.nickname}
                    secondary={`@${user.username}`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </div>
  );
}
