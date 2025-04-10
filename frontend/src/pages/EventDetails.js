import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  ImageList,
  ImageListItem,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Dialog,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GoogleIcon from '@mui/icons-material/Google';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const theme = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);

  const steps = ['Select Package', 'Booking Details', 'Payment Details', 'Confirmation'];

  const [bookingDetails, setBookingDetails] = useState({
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
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(response.data);
      if (response.data.packages.length > 0) {
        setSelectedPackage(response.data.packages[0]);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailsChange = (event) => {
    const { name, value } = event.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingDetailsChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBookingDetails((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBookingDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNext = () => {
    if (isAdmin) {
      showAlert('Administrators cannot book events', 'error');
      return;
    }

    if (activeStep === 0 && !user) {
      navigate('/login');
      return;
    }

    // Validate booking details before proceeding to payment
    if (activeStep === 1) {
      if (!bookingDetails.eventDate || !bookingDetails.guestCount || !bookingDetails.contactInfo.phone || !bookingDetails.contactInfo.address) {
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePayNow = () => {
    // Simulate payment processing
    setTimeout(() => {
      // Complete the booking process
      handleBooking();
    }, 1500);
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const bookingData = {
        event: id,
        package: {
          name: selectedPackage.name,
          price: selectedPackage.price,
        },
        eventDate: bookingDetails.eventDate,
        guestCount: parseInt(bookingDetails.guestCount),
        totalAmount: selectedPackage.price,
        contactInfo: bookingDetails.contactInfo,
      };

      await axios.post('http://localhost:5000/api/bookings', bookingData);
      setActiveStep(3); // Move to confirmation step
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleDownloadReceipt = () => {
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
              padding: 40px;
              border-radius: 16px;
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
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 2px solid var(--border-color);
              position: relative;
            }
            .logo {
              font-size: 32px;
              font-weight: 700;
              background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
              letter-spacing: 1px;
            }
            .receipt-title {
              font-size: 24px;
              color: var(--primary-color);
              margin-bottom: 8px;
              font-weight: 600;
            }
            .receipt-date {
              color: var(--text-secondary);
              font-size: 14px;
              font-weight: 400;
            }
            .section {
              margin-bottom: 30px;
              background: var(--background-light);
              padding: 25px;
              border-radius: 12px;
              border: 1px solid var(--border-color);
              transition: transform 0.2s ease;
            }
            .section:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: var(--primary-color);
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid var(--border-color);
              display: flex;
              align-items: center;
            }
            .section-title::before {
              content: '';
              display: inline-block;
              width: 4px;
              height: 18px;
              background: var(--primary-color);
              margin-right: 8px;
              border-radius: 2px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              padding: 8px 0;
              border-bottom: 1px dashed var(--border-color);
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              color: var(--text-secondary);
              font-weight: 500;
              font-size: 14px;
            }
            .info-value {
              font-weight: 500;
              color: var(--text-primary);
              font-size: 14px;
            }
            .total-section {
              margin-top: 40px;
              padding: 25px;
              background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
              border-radius: 12px;
              color: white;
              box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 20px;
              font-weight: 600;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: var(--text-secondary);
              font-size: 14px;
              padding-top: 20px;
              border-top: 2px solid var(--border-color);
            }
            .footer p {
              margin: 5px 0;
            }
            .contact-info {
              margin-top: 15px;
              font-size: 13px;
              color: var(--text-secondary);
              background: var(--background-light);
              padding: 15px;
              border-radius: 8px;
            }
            .receipt-number {
              text-align: right;
              font-size: 14px;
              color: var(--text-secondary);
              margin-bottom: 20px;
              padding: 8px 16px;
              background: var(--background-light);
              border-radius: 8px;
              display: inline-block;
              float: right;
            }
            .receipt-number span {
              font-weight: 600;
              color: var(--primary-color);
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 100px;
              color: rgba(25, 118, 210, 0.03);
              font-weight: 700;
              white-space: nowrap;
              pointer-events: none;
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
              .watermark {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="watermark">EVENTS AND VIBES</div>
            <div class="receipt-number">
              Receipt #: <span>${Date.now().toString().slice(-8)}</span>
            </div>
            
            <div class="header">
              <div class="logo">Events and Vibes</div>
              <div class="receipt-title">Booking Receipt</div>
              <div class="receipt-date">Generated on: ${currentDate}</div>
            </div>

            <div class="section">
              <div class="section-title">Event Details</div>
              <div class="info-row">
                <span class="info-label">Event Name:</span>
                <span class="info-value">${event.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Event Date:</span>
                <span class="info-value">${new Date(bookingDetails.eventDate).toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Guest Count:</span>
                <span class="info-value">${bookingDetails.guestCount} guests</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Package Details</div>
              <div class="info-row">
                <span class="info-label">Package Name:</span>
                <span class="info-value">${selectedPackage.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Duration:</span>
                <span class="info-value">${selectedPackage.duration}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Capacity:</span>
                <span class="info-value">Up to ${selectedPackage.capacity} guests</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Customer Information</div>
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">${user.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${user.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${bookingDetails.contactInfo.phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">${bookingDetails.contactInfo.address}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Payment Information</div>
              <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${
                  paymentMethod === 'card' ? 'Credit/Debit Card' : 
                  paymentMethod === 'googlepay' ? 'Google Pay' : 
                  paymentMethod === 'phonepe' ? 'PhonePe' : 'Paytm'
                }</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Status:</span>
                <span class="info-value">Paid</span>
              </div>
            </div>

            <div class="total-section">
              <div class="total-row">
                <span>Total Amount Paid:</span>
                <span>₹${selectedPackage.price}</span>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Events and Vibes!</p>
              <div class="contact-info">
                <p>For any queries, please contact us at:</p>
                <p>Email: support@eventsandvibes.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: 123 Event Street, Pune, Maharashtra 411001</p>
              </div>
            </div>
          </div>

          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="
              padding: 12px 24px;
              font-size: 16px;
              cursor: pointer;
              background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
              color: white;
              border: none;
              border-radius: 8px;
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

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Typography>Event not found</Typography>
      </Container>
    );
  }

  const renderBookingStep = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Booking Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Event Date"
                      value={bookingDetails.eventDate}
                      onChange={(newValue) => {
                        setBookingDetails((prev) => ({
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
                    value={bookingDetails.guestCount}
                    onChange={handleBookingDetailsChange}
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
                    value={bookingDetails.contactInfo.phone}
                    onChange={handleBookingDetailsChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="contactInfo.address"
                    value={bookingDetails.contactInfo.address}
                    onChange={handleBookingDetailsChange}
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
                    value={bookingDetails.contactInfo.specialRequirements}
                    onChange={handleBookingDetailsChange}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>Event:</strong> {event.name}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Package:</strong> {selectedPackage.name}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Duration:</strong> {selectedPackage.duration}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Capacity:</strong> Up to {selectedPackage.capacity} guests
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ₹{selectedPackage.price}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 8 }}>
        <Button onClick={handleBack}>Back</Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!bookingDetails.eventDate || !bookingDetails.guestCount || !bookingDetails.contactInfo.phone || !bookingDetails.contactInfo.address}
          sx={{ mb: 4 }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );

  const renderPaymentStep = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Payment Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>Event:</strong> {event.name}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Package:</strong> {selectedPackage.name}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Duration:</strong> {selectedPackage.duration}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Capacity:</strong> Up to {selectedPackage.capacity} guests
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ₹{selectedPackage.price}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Select Payment Method
                </Typography>
                
                <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    sx={{ gap: 1 }}
                  >
                    <Card sx={{ 
                      p: 1.5, 
                      cursor: 'pointer',
                      border: paymentMethod === 'card' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      '&:hover': { borderColor: theme.palette.primary.main }
                    }}>
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCardIcon />
                            <Typography>Credit/Debit Card</Typography>
                          </Box>
                        }
                      />
                    </Card>

                    <Card sx={{ 
                      p: 1.5, 
                      cursor: 'pointer',
                      border: paymentMethod === 'googlepay' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      '&:hover': { borderColor: theme.palette.primary.main }
                    }}>
                      <FormControlLabel
                        value="googlepay"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GoogleIcon />
                            <Typography>Google Pay</Typography>
                          </Box>
                        }
                      />
                    </Card>

                    <Card sx={{ 
                      p: 1.5, 
                      cursor: 'pointer',
                      border: paymentMethod === 'phonepe' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      '&:hover': { borderColor: theme.palette.primary.main }
                    }}>
                      <FormControlLabel
                        value="phonepe"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneAndroidIcon />
                            <Typography>PhonePe</Typography>
                          </Box>
                        }
                      />
                    </Card>

                    <Card sx={{ 
                      p: 1.5, 
                      cursor: 'pointer',
                      border: paymentMethod === 'paytm' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                      '&:hover': { borderColor: theme.palette.primary.main }
                    }}>
                      <FormControlLabel
                        value="paytm"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountBalanceWalletIcon />
                            <Typography>Paytm</Typography>
                          </Box>
                        }
                      />
                    </Card>
                  </RadioGroup>
                </FormControl>

                {paymentMethod && (
                  <Box sx={{ mt: 3 }}>
                    {paymentMethod === 'card' && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Card Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Card Number"
                              name="cardNumber"
                              value={cardDetails.cardNumber}
                              onChange={handleCardDetailsChange}
                              placeholder="1234 5678 9012 3456"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Card Holder Name"
                              name="cardName"
                              value={cardDetails.cardName}
                              onChange={handleCardDetailsChange}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Expiry Date"
                              name="expiry"
                              value={cardDetails.expiry}
                              onChange={handleCardDetailsChange}
                              placeholder="MM/YY"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="CVV"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardDetailsChange}
                              placeholder="123"
                              size="small"
                            />
                          </Grid>
                        </Grid>
                        <Button
                          variant="contained"
                          fullWidth
                          size="medium"
                          onClick={handlePayNow}
                          disabled={!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv}
                          sx={{ mt: 2 }}
                        >
                          Pay ₹{selectedPackage.price}
                        </Button>
                      </Box>
                    )}

                    {paymentMethod === 'googlepay' && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <GoogleIcon sx={{ fontSize: 30, color: '#4285F4' }} />
                          <Typography variant="h6">Google Pay</Typography>
                        </Box>
                        <TextField
                          fullWidth
                          label="UPI ID"
                          placeholder="Enter your UPI ID"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          size="medium"
                          onClick={handlePayNow}
                          sx={{
                            bgcolor: '#4285F4',
                            '&:hover': { bgcolor: '#357ABD' }
                          }}
                        >
                          Pay ₹{selectedPackage.price}
                        </Button>
                      </Box>
                    )}

                    {paymentMethod === 'phonepe' && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <PhoneAndroidIcon sx={{ fontSize: 30, color: '#5f259f' }} />
                          <Typography variant="h6">PhonePe</Typography>
                        </Box>
                        <TextField
                          fullWidth
                          label="UPI ID"
                          placeholder="Enter your UPI ID"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          size="medium"
                          onClick={handlePayNow}
                          sx={{
                            bgcolor: '#5f259f',
                            '&:hover': { bgcolor: '#4a1d7c' }
                          }}
                        >
                          Pay ₹{selectedPackage.price}
                        </Button>
                      </Box>
                    )}

                    {paymentMethod === 'paytm' && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <AccountBalanceWalletIcon sx={{ fontSize: 30, color: '#00BAF2' }} />
                          <Typography variant="h6">Paytm</Typography>
                        </Box>
                        <TextField
                          fullWidth
                          label="UPI ID"
                          placeholder="Enter your UPI ID"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          size="medium"
                          onClick={handlePayNow}
                          sx={{
                            bgcolor: '#00BAF2',
                            '&:hover': { bgcolor: '#0095C8' }
                          }}
                        >
                          Pay ₹{selectedPackage.price}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Scan QR Code
                  </Typography>
                  
                  {paymentMethod === 'card' && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <CreditCardIcon sx={{ fontSize: 50, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Please enter your card details on the left to complete the payment.
                      </Typography>
                    </Box>
                  )}
                  
                  {paymentMethod === 'googlepay' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Scan this QR code with your Google Pay app
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        p: 1,
                        border: '1px dashed #ccc',
                        borderRadius: 1
                      }}>
                        <Box 
                          component="img" 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=eventsandvibes@okicici&pn=Events%20and%20Vibes&am=${selectedPackage.price}&cu=INR`} 
                          alt="Google Pay QR Code"
                          sx={{ width: 150, height: 150 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Or enter your UPI ID on the left
                      </Typography>
                    </Box>
                  )}
                  
                  {paymentMethod === 'phonepe' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Scan this QR code with your PhonePe app
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        p: 1,
                        border: '1px dashed #ccc',
                        borderRadius: 1
                      }}>
                        <Box 
                          component="img" 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=eventsandvibes@ybl&pn=Events%20and%20Vibes&am=${selectedPackage.price}&cu=INR`} 
                          alt="PhonePe QR Code"
                          sx={{ width: 150, height: 150 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Or enter your UPI ID on the left
                      </Typography>
                    </Box>
                  )}
                  
                  {paymentMethod === 'paytm' && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Scan this QR code with your Paytm app
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        p: 1,
                        border: '1px dashed #ccc',
                        borderRadius: 1
                      }}>
                        <Box 
                          component="img" 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=eventsandvibes@paytm&pn=Events%20and%20Vibes&am=${selectedPackage.price}&cu=INR`} 
                          alt="Paytm QR Code"
                          sx={{ width: 150, height: 150 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Or enter your UPI ID on the left
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack}>Back</Button>
      </Box>
    </Box>
  );

  const renderConfirmationStep = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Booking Confirmation
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Booking Successful!
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              Thank you for booking with Events and Vibes. Your event has been successfully scheduled.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Event Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {event.name}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Event Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Selected Package
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedPackage.name}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Package Duration
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedPackage.duration}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Guest Capacity
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Up to {selectedPackage.capacity} guests
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {paymentMethod === 'card' && <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    {paymentMethod === 'googlepay' && <GoogleIcon sx={{ mr: 1, color: '#4285F4' }} />}
                    {paymentMethod === 'phonepe' && <PhoneAndroidIcon sx={{ mr: 1, color: '#5f259f' }} />}
                    {paymentMethod === 'paytm' && <AccountBalanceWalletIcon sx={{ mr: 1, color: '#00BAF2' }} />}
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {paymentMethod === 'card' ? 'Credit/Debit Card' : 
                       paymentMethod === 'googlepay' ? 'Google Pay' : 
                       paymentMethod === 'phonepe' ? 'PhonePe' : 'Paytm'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Total Amount Paid:</Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                ₹{selectedPackage.price}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleDownloadReceipt}
                sx={{ 
                  py: 1.5,
                  px: 3,
                  fontWeight: 600
                }}
              >
                Download Receipt
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/events')}
                sx={{ 
                  py: 1.5,
                  px: 3
                }}
              >
                Browse More Events
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="h6" gutterBottom>
              Package Features
            </Typography>
            
            <List>
              {selectedPackage.features.map((feature, index) => (
                <ListItem key={index} disablePadding sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Need Assistance?
              </Typography>
              <Typography variant="body2" paragraph>
                Our team is here to help you with any questions about your booking.
              </Typography>
              <Button 
                variant="text" 
                startIcon={<PhoneAndroidIcon />}
                sx={{ color: theme.palette.primary.main }}
              >
                Contact Support
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          width: '100%',
          overflow: 'hidden',
          mb: 6,
        }}
      >
        <Box
          component="img"
          src={event.images[0]}
          alt={event.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7)',
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pb: 6,
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: 'absolute',
              top: 20,
              left: 24,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.5)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Fade in timeout={1000}>
            <Box>
              <Chip
                label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.9),
                  color: 'white',
                  mb: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  mb: 2,
                }}
              >
                {event.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  maxWidth: '800px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {event.description}
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {isAdmin && (
          <Alert severity="info" sx={{ mb: 3 }}>
            As an administrator, you can view event details but cannot make bookings.
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {activeStep === 0 && (
            <>
              {/* Image Gallery */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Gallery
                </Typography>
                <ImageList
                  sx={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))!important',
                    gap: '16px!important',
                  }}
                  gap={16}
                >
                  {event.images.map((image, index) => (
                    <ImageListItem
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        overflow: 'hidden',
                        borderRadius: 2,
                        '&:hover img': {
                          transform: 'scale(1.1)',
                        },
                      }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${event.name} - ${index + 1}`}
                        loading="lazy"
                        style={{
                          height: '200px',
                          width: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>

              {/* Packages */}
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Available Packages
                </Typography>
                <Grid container spacing={3}>
                  {event.packages.map((pkg) => (
                    <Grid item xs={12} md={6} key={pkg.name}>
                      <Zoom in timeout={500}>
                        <Card
                          elevation={selectedPackage?.name === pkg.name ? 8 : 1}
                          sx={{
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: selectedPackage?.name === pkg.name ? 'scale(1.02)' : 'none',
                            border: selectedPackage?.name === pkg.name 
                              ? `3px solid ${theme.palette.primary.main}` 
                              : '1px solid #e0e0e0',
                            position: 'relative',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: theme.shadows[8],
                            },
                          }}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          {selectedPackage?.name === pkg.name && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                boxShadow: theme.shadows[3],
                              }}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </Box>
                          )}
                          <CardContent>
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                {pkg.name}
                              </Typography>
                              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                                ₹{pkg.price}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {pkg.duration}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  Up to {pkg.capacity} guests
                                </Typography>
                              </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                              {pkg.features.map((feature, index) => (
                                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <CheckCircleOutlineIcon color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={feature}
                                    primaryTypographyProps={{
                                      variant: 'body2',
                                      color: 'text.secondary',
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Selected Package Summary */}
              {selectedPackage && (
                <Grid item xs={12}>
                  <Card 
                    sx={{ 
                      p: 3, 
                      mt: 4, 
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Selected Package: {selectedPackage.name}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            <strong>Duration:</strong> {selectedPackage.duration}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            <strong>Capacity:</strong> Up to {selectedPackage.capacity} guests
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            <strong>Features:</strong> {selectedPackage.features.length} included
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            <strong>Price:</strong> ₹{selectedPackage.price}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              )}

              {/* Next Button */}
              {selectedPackage && !isAdmin && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 8 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleNext}
                      sx={{
                        py: 2,
                        px: 6,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[8],
                        },
                      }}
                    >
                      Proceed to Payment
                    </Button>
                  </Box>
                </Grid>
              )}
            </>
          )}

          {activeStep === 1 && renderBookingStep()}

          {activeStep === 2 && renderPaymentStep()}

          {activeStep === 3 && renderConfirmationStep()}
        </Grid>
      </Container>

      {/* Image Preview Dialog */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.5)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EventDetails;