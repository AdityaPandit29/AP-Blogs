// import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function BasicButtons() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      {isSmallScreen ? (
        // Small screen: circular "+" button fixed at bottom right
        <Stack
          sx={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1300,
            
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '50%',
              minWidth: 0,
              width: 64,
              height: 64,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Add"
            href='/create'
          >
            <AddIcon />
          </Button>
        </Stack>
      ) : (
        // Large screen: full button fixed top left
        <Stack
          spacing={2}
          direction="row"
          sx={{
            position: 'fixed',
            top: '80px',
            left: '16px',
            zIndex: 1300,
          }}
        >
          <Button variant="contained" sx={{ borderRadius: '20px' }} href='/create'>
            <AddIcon /> New Blog
          </Button>
        </Stack>
      )}
    </>
  );
}
