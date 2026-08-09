import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import type { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface Post {
  id: string;
  title: string;
  description?: string;
  content: string;
  updated_at: string;
}

interface OtherPostProps {
  post: Post;
}

const ExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => {
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
}));

export default function OtherPost({ post }: OtherPostProps) {
  const [expanded, setExpanded] = React.useState(false);

  function getUpdatedDateOrTime() {
    const curDate = new Date().toString().slice(4, 15);
    const updatedDate = new Date(post.updated_at).toString().slice(4, 15);
    const updatedTime = new Date(post.updated_at);

    if (curDate === updatedDate) {
      let hours = updatedTime.getHours();
      const minutes = updatedTime.getMinutes().toString().padStart(2, '0');
      let timeMarker = 'am';

      if (hours >= 12) timeMarker = 'pm';
      hours = hours % 12;
      if (hours === 0 || hours === 12) hours = 12;

      return `${hours.toString().padStart(2, '0')}:${minutes} ${timeMarker}`;
    }

    return updatedDate;
  }

  return (
    <Card sx={{ margin: '20px auto' }}>
      <CardHeader
        title={post.title}
        subheader={
          <Typography variant="body2" fontSize="14px" color="text.secondary">
            {getUpdatedDateOrTime()}
          </Typography>
        }
      />
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
          {post.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Typography sx={{ marginBottom: 2 }}>
            {post.content}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
