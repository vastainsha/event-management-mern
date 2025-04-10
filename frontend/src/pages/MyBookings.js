import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  People,
  AccessTime,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  CalendarToday,
  Payment,
  CheckCircle,
  Cancel,
  Pending,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from '../context/AlertContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const validBookings = response.data.filter(booking => booking.event);
      setBookings(validBookings);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/bookings/${selectedBooking._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.filter(b => b._id !== selectedBooking._id));
      setDeleteDialogOpen(false);
      showAlert('Booking cancelled successfully', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
      showAlert('Failed to cancel booking', 'error');
    }
  };

  const handleEditClick = (booking) => {
    navigate(`/events/${booking.event._id}`, { state: { booking } });
  };

  const handleDownloadReceipt = (booking) => {
    const receiptWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Booking Receipt - ${currentDate}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            :root {
              --primary-color: #1976d2;
              --primary-light: #42a5f5;
              --primary-dark: #1565c0;
              --secondary-color: #f50057;
              --text-primary: #333333;
              --text-secondary: #666666;
              --background-light: #f5f5f5;
              --background-white: #ffffff;
              --border-color: #e0e0e0;
            }
            
            body {
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 20px;
              background: var(--background-light);
              color: var(--text-primary);
            }
            .receipt {
              max-width: 800px;
              margin: 0 auto;
              background: var(--background-white);
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
              position: relative;
              overflow: hidden;
            }
            .receipt::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid var(--border-color);
              position: relative;
            }
            .logo {
              font-size: 28px;
              font-weight: 700;
              background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 8px;
              letter-spacing: 1px;
            }
            .receipt-title {
              font-size: 20px;
              color: var(--primary-color);
              margin-bottom: 4px;
              font-weight: 600;
            }
            .receipt-date {
              color: var(--text-secondary);
              font-size: 12px;
              font-weight: 400;
            }
            .content {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .section {
              background: var(--background-light);
              padding: 15px;
              border-radius: 8px;
              border: 1px solid var(--border-color);
            }
            .section-title {
              font-size: 14px;
              font-weight: 600;
              color: var(--primary-color);
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid var(--border-color);
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 12px;
            }
            .info-label {
              color: var(--text-secondary);
              font-weight: 500;
            }
            .info-value {
              font-weight: 500;
              color: var(--text-primary);
            }
            .total-section {
              margin-top: 20px;
              padding: 15px;
              background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
              border-radius: 8px;
              color: white;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              font-weight: 600;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              color: var(--text-secondary);
              font-size: 12px;
              padding-top: 15px;
              border-top: 1px solid var(--border-color);
            }
            .receipt-number {
              text-align: right;
              font-size: 12px;
              color: var(--text-secondary);
              margin-bottom: 15px;
            }
            .receipt-number span {
              font-weight: 600;
              color: var(--primary-color);
            }
            @media print {
              body {
                background: white;
              }
              .receipt {
                box-shadow: none;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="receipt-number">
              Receipt #: <span>${booking._id.slice(-8)}</span>
            </div>
            
            <div class="header">
              <div class="logo">Events and Vibes</div>
              <div class="receipt-title">Booking Receipt</div>
              <div class="receipt-date">Generated on: ${currentDate}</div>
            </div>

            <div class="content">
              <div class="section">
                <div class="section-title">Event Details</div>
                <div class="info-row">
                  <span class="info-label">Event:</span>
                  <span class="info-value">${booking.event.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${new Date(booking.eventDate).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Guests:</span>
                  <span class="info-value">${booking.guestCount}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Customer Information</div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${booking.user.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${booking.user.email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${booking.contactInfo.phone}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Package Details</div>
                <div class="info-row">
                  <span class="info-label">Package:</span>
                  <span class="info-value">${booking.package.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Duration:</span>
                  <span class="info-value">${booking.event.duration}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Capacity:</span>
                  <span class="info-value">${booking.event.capacity} guests</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Payment Information</div>
                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment:</span>
                  <span class="info-value">${booking.status === 'confirmed' ? 'Paid' : 'Pending'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Amount:</span>
                  <span class="info-value">₹${booking.totalAmount}</span>
                </div>
              </div>
            </div>

            <div class="total-section">
              <div class="total-row">
                <span>Total Amount Paid:</span>
                <span>₹${booking.totalAmount}</span>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Events and Vibes!</p>
              <Typography variant="body2" color="text.secondary" align="center">
                <p>For queries: info@eventsandvibes.com | +91 98765 43210</p>
              </Typography>
            </div>
          </div>

          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="
              padding: 10px 20px;
              font-size: 14px;
              cursor: pointer;
              background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
              color: white;
              border: none;
              border-radius: 6px;
              font-family: 'Poppins', sans-serif;
              font-weight: 500;
              box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(25, 118, 210, 0.3)'" 
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(25, 118, 210, 0.2)'">Print Receipt</button>
          </div>
        </body>
      </html>
    `);

    receiptWindow.document.close();
    receiptWindow.focus();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'cancelled':
        return <Cancel />;
      default:
        return null;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 0) return true; // All bookings
    if (activeTab === 1) return booking.status === 'pending';
    if (activeTab === 2) return booking.status === 'confirmed';
    if (activeTab === 3) return booking.status === 'cancelled';
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={fetchBookings}>Retry</Button>
      </Container>
    );
  }

  if (bookings.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Bookings Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You haven't made any bookings yet. Start planning your next event!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/events')}
            startIcon={<EventIcon />}
          >
            Browse Events
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage and view your event bookings
        </Typography>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Tab label="All Bookings" />
            <Tab label="Pending" />
            <Tab label="Confirmed" />
            <Tab label="Cancelled" />
          </Tabs>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {filteredBookings.map((booking) => (
          <Grid item xs={12} key={booking._id}>
            <Card
              elevation={2}
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box
                      component="img"
                      src={booking.event.images[0]}
                      alt={booking.event.name}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {booking.event.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip
                            label={booking.event.type}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                          <Chip
                            label={booking.package.name}
                            size="small"
                            color="primary"
                          />
                          <Chip
                            icon={getStatusIcon(booking.status)}
                            label={booking.status}
                            size="small"
                            color={getStatusColor(booking.status)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      </Box>
                      <Box>
                        {booking.status === 'pending' && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(booking)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(booking)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {booking.event.location || 'Location not specified'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {booking.guestCount} guests
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Payment Status: {booking.status === 'confirmed' ? 'Paid' : 'Pending'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="h6" color="primary">
                          ₹{booking.totalAmount.toLocaleString()}
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadReceipt(booking)}
                          sx={{ ml: 2 }}
                        >
                          Download Receipt
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Confirm Cancellation
            <IconButton onClick={() => setDeleteDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No, Keep Booking</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookings; 