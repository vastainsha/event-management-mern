import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

const Booking = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;

  const [formData, setFormData] = useState({
    eventDate: null,
    guestCount: '',
    contactInfo: {
      phone: '',
      address: '',
      specialRequirements: '',
    },
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      setError('Error fetching event details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const bookingData = {
        event: eventId,
        package: {
          name: selectedPackage.name,
          price: selectedPackage.price,
        },
        eventDate: formData.eventDate,
        guestCount: parseInt(formData.guestCount),
        totalAmount: selectedPackage.price,
        contactInfo: formData.contactInfo,
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating booking');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!event || !selectedPackage) {
    return (
      <Container>
        <Typography>Event or package not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Event
        </Typography>
        <Typography variant="h6" gutterBottom>
          {event.name} - {selectedPackage.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Booking successful! Redirecting to your bookings...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Event Date"
                  value={formData.eventDate}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      eventDate: newValue,
                    }));
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Number of Guests"
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{
                  min: 1,
                  max: selectedPackage.capacity,
                }}
                helperText={`Maximum capacity: ${selectedPackage.capacity} guests`}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                name="contactInfo.address"
                value={formData.contactInfo.address}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Special Requirements"
                name="contactInfo.specialRequirements"
                value={formData.contactInfo.specialRequirements}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Total Amount: ${selectedPackage.price}
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={success}
                >
                  Confirm Booking
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Booking; 