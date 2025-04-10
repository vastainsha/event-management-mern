import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useAlert } from '../context/AlertContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showAlert } = useAlert();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post('http://localhost:5000/api/messages', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      showAlert('Message sent successfully!', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showAlert('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          Contact Us
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              backgroundColor: alpha(theme.palette.primary.main, 0.05)
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="primary">
              Get in Touch
            </Typography>
            <Typography variant="body1" paragraph>
              We're here to help with any questions you might have about our event management services.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Email</Typography>
                  <Typography variant="body2">info@eventmanagement.com</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Phone</Typography>
                  <Typography variant="body2">+1 (123) 456-7890</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Address</Typography>
                  <Typography variant="body2">123 Event Street, City, Country</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="primary">
              Send Us a Message
            </Typography>
            
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Your message has been sent successfully! We'll get back to you soon.
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    disabled={loading}
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact; 