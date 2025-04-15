import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateTitle } from '../utils/titleUtils';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  CardActionArea,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import AnimatedCard from '../components/AnimatedCard';
import axios from 'axios';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    updateTitle(); // Set default title for home page
    const fetchFeaturedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setFeaturedEvents(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured events:', error);
      }
    };

    fetchFeaturedEvents();
  }, []);

  const eventTypes = [
    { name: 'Wedding', icon: '💒', path: '/events?type=wedding' },
    { name: 'Birthday', icon: '🎂', path: '/events?type=birthday' },
    { name: 'Corporate', icon: '💼', path: '/events?type=corporate' },
    { name: 'Anniversary', icon: '💝', path: '/events?type=anniversary' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        className="hero"
        sx={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box className="hero-content">
            <Typography
              variant="h1"
              className="hero-title"
              sx={{
                fontFamily: theme.typography.h1.fontFamily,
                fontWeight: 700,
                mb: 2,
                color: 'white',
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Create Unforgettable Moments
            </Typography>
            <Typography
              variant="h5"
              className="hero-subtitle"
              sx={{
                mb: 4,
                maxWidth: '600px',
                color: 'white',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
              }}
            >
              From intimate gatherings to grand celebrations, we craft the perfect event experience tailored just for you.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/events')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                }}
              >
                Browse Events
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/events?type=wedding')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Wedding Packages
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Event Types Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              mb: 6,
              fontFamily: theme.typography.h1.fontFamily,
              fontWeight: 600,
            }}
          >
            Event Types
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {eventTypes.map((type) => (
              <Grid item xs={6} sm={3} key={type.name}>
                <AnimatedCard
                  onClick={() => navigate(type.path)}
                  sx={{ p: 3 }}
                >
                  <Typography variant="h2" sx={{ mb: 2, transition: 'transform 0.3s ease' }}>
                    {type.icon}
                  </Typography>
                  <Typography variant="h6" align="center" sx={{ transition: 'color 0.3s ease' }}>
                    {type.name}
                  </Typography>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Events Section */}
      <Box sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              mb: 6,
              fontFamily: theme.typography.h1.fontFamily,
              fontWeight: 600,
            }}
          >
            Featured Events
          </Typography>
          <Grid container spacing={4}>
            {featuredEvents.map((event) => (
              <Grid item xs={12} md={4} key={event._id}>
                <AnimatedCard
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={event.images[0] || 'https://via.placeholder.com/300x200'}
                    alt={event.name}
                    sx={{
                      transition: 'transform 0.3s ease',
                      borderRadius: '12px 12px 0 0',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontFamily: theme.typography.h1.fontFamily,
                          fontWeight: 600,
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {event.name}
                      </Typography>
                      <Chip
                        label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        size="small"
                        color="primary"
                        sx={{
                          borderRadius: 1,
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          }
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {event.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          transition: 'color 0.3s ease',
                        }}
                      >
                        Starting from ₹{event.packages[0]?.price || 'Contact us'}
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        sx={{
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(51, 102, 255, 0.08)',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/events')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
              }}
            >
              View All Events
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 