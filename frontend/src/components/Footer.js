import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[800],
        color: 'white',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: theme.palette.primary.light }} />
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: theme.palette.primary.light,
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Events & Vibes
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Your one-stop platform for discovering and booking amazing events.
              From concerts to conferences, we've got you covered.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                aria-label="Facebook"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.light,
                    transform: 'translateY(-3px)',
                    opacity: 1,
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.light,
                    transform: 'translateY(-3px)',
                    opacity: 1,
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.light,
                    transform: 'translateY(-3px)',
                    opacity: 1,
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.light,
                    transform: 'translateY(-3px)',
                    opacity: 1,
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/events"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '-2px',
                    left: '0',
                    backgroundColor: theme.palette.primary.light,
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    color: theme.palette.primary.light,
                    opacity: 1,
                    '&:after': {
                      width: '100%',
                    },
                  },
                }}
              >
                Browse Events
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '-2px',
                    left: '0',
                    backgroundColor: theme.palette.primary.light,
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    color: theme.palette.primary.light,
                    opacity: 1,
                    '&:after': {
                      width: '100%',
                    },
                  },
                }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '-2px',
                    left: '0',
                    backgroundColor: theme.palette.primary.light,
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    color: theme.palette.primary.light,
                    opacity: 1,
                    '&:after': {
                      width: '100%',
                    },
                  },
                }}
              >
                Contact Us
              </Link>
              <Link
                component={RouterLink}
                to="/faq"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '-2px',
                    left: '0',
                    backgroundColor: theme.palette.primary.light,
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    color: theme.palette.primary.light,
                    opacity: 1,
                    '&:after': {
                      width: '100%',
                    },
                  },
                }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              123, Koregaon Park
              <br />
              Pune, Maharashtra 411001
              <br />
              India
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Email: support@eventsandvibes.com
              <br />
              Phone: +91 98765 43210
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Typography variant="body2" sx={{ opacity: 0.7 }} align="center">
          © {currentYear} Events & Vibes. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }} align="center">
          © Aditya Maksare & Insha Vasta
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 