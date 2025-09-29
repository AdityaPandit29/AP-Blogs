import React from 'react';
import { Box, Paper, Typography, Avatar, Divider, Stack } from '@mui/material';
import MyPost from '../MyPost.tsx';
import NavBar from '../NavBar.tsx';
import NewPostButton from '../NewPostButton.tsx';

interface Post {
  id: string;
  title: string;
  description?: string; // ? means optional
  content: string;
  updated_at: string;
}

interface ProfilePageProps {
  username: string;
  nickname: string;
  avatarUrl?: string;
  posts: Post[];
}

export default function ProfilePage({ username, nickname, avatarUrl, posts }: ProfilePageProps) {
  
  return (
    <div>
    <NavBar />
    <NewPostButton />
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#545454ff',
      p: 4,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <Paper elevation={6} sx={{ width: 800, p: 4, borderRadius: 4 }}>
        {/* User info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar 
            src={avatarUrl} 
            alt={username} 
            sx={{ width: 80, height: 80, fontSize: 40, bgcolor: 'primary.main' }} 
          >
            {nickname[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">{nickname}</Typography>
            <Typography variant="subtitle1" color="text.secondary">@{username}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }}/>

        {/* Posts section */}
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
          Your Blogs ({posts.length})
        </Typography>

        {posts.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You have no posts yet. Start sharing your thoughts!
          </Typography>
        ) : (
          <Stack spacing={3}>
            {posts.map(post => (
              <MyPost post={post}/>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
    </div>
  );
}
