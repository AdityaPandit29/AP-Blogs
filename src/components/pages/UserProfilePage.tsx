import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Divider, Paper, Stack, Typography } from '@mui/material';
import NavBar from '../NavBar.tsx';
import OtherPost from '../OtherPost.tsx';
import { apiFetch } from '../../api.ts';

interface Post {
  id: string;
  title: string;
  description?: string;
  content: string;
  updated_at: string;
}

interface UserProfile {
  username: string;
  nickname: string;
  posts: Post[];
}

interface UserProfilePageProps {
  setUser: (user: any) => void;
  currentUsername?: string;
}

export default function UserProfilePage({ setUser, currentUsername }: UserProfilePageProps) {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username && currentUsername && username === currentUsername) {
      navigate('/profile', { replace: true });
    }
  }, [username, currentUsername, navigate]);

  useEffect(() => {
    async function loadProfile() {
      if (!username) return;
      if (currentUsername && username === currentUsername) return;

      setLoading(true);
      setError('');
      try {
        const res = await apiFetch(`/api/users/${encodeURIComponent(username)}`);
        if (res.status === 404) {
          setError('User not found.');
          setProfile(null);
          return;
        }
        if (!res.ok) {
          setError('Failed to load profile.');
          setProfile(null);
          return;
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError('Unexpected error occurred.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username, currentUsername]);

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
          {loading && <Typography>Loading profile...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {!loading && !error && profile && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar
                  alt={profile.username}
                  sx={{ width: 80, height: 80, fontSize: 40, bgcolor: 'primary.main' }}
                >
                  {profile.nickname[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{profile.nickname}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    @{profile.username}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
                Blogs ({profile.posts.length})
              </Typography>

              {profile.posts.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  This user has no posts yet.
                </Typography>
              ) : (
                <Stack spacing={3}>
                  {profile.posts.map((post) => (
                    <OtherPost key={post.id} post={post} />
                  ))}
                </Stack>
              )}
            </>
          )}
        </Paper>
      </Box>
    </div>
  );
}
