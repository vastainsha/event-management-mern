import React, { useState, useEffect, useRef } from 'react';
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
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Avatar,
  Tooltip,
  Badge,
  alpha,
  Fade,
  Zoom,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  People,
  CalendarToday,
  CheckCircle,
  Cancel,
  Pending,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from '../context/AlertContext';
import { updateTitle } from '../utils/titleUtils';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
    recentBookings: 0,
    activeEvents: 0,
  });
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const printRef = useRef();

  useEffect(() => {
    updateTitle('Admin Dashboard');
    fetchBookings();
  }, []);

  useEffect(() => {
    // Calculate stats whenever bookings change
    if (bookings.length > 0) {
      const newStats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        revenue: bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        recentBookings: bookings.filter(b => new Date(b.eventDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
        activeEvents: bookings.filter(b => b.event).length,
      };
      setStats(newStats);
    }
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      console.log('Admin token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // Create axios instance with base URL
      const api = axios.create({
        baseURL: '/api',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Fetching bookings from API...');
      const response = await api.get('/admin/bookings');
      
      console.log('Bookings response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from server');
      }

      // Log details about the first few bookings
      response.data.slice(0, 3).forEach((booking, index) => {
        console.log(`Frontend Booking ${index + 1}:`, {
          id: booking._id,
          eventId: booking.event?._id || booking.event,
          hasUser: !!booking.user,
          hasEvent: !!booking.event,
          hasPackage: !!booking.package,
          user: booking.user ? { id: booking.user._id, name: booking.user.name } : null,
          event: booking.event ? { id: booking.event._id, name: booking.event.name } : null,
          package: booking.package ? { id: booking.package._id, name: booking.package.name } : null
        });
      });

      // Transform bookings with fallback values
      const validBookings = response.data.map(booking => ({
        ...booking,
        hasEvent: !!booking.event,
        eventName: booking.event?.name || 'Event Not Found',
        eventType: booking.event?.type || 'Unknown',
        userName: booking.user?.name || 'Unknown User',
        packageName: booking.package?.name || 'Unknown Package',
        status: booking.status || 'pending',
        totalAmount: booking.totalAmount || 0,
        eventDate: booking.eventDate || new Date().toISOString(),
        guestCount: booking.guestCount || 0
      }));

      console.log('Valid bookings:', validBookings.length);
      setBookings(validBookings);
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        if (error.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else if (error.response.status === 404) {
          setError('Backend server not found. Please ensure the backend server is running on port 5000.');
        } else {
          setError(error.response.data.message || 'Failed to fetch bookings');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('No response from server. Please check if the backend server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError('Failed to fetch bookings: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (booking, action) => {
    setSelectedBooking(booking);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `/api/admin/bookings/${selectedBooking._id}`,
        { status: actionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(bookings.map(booking =>
        booking._id === selectedBooking._id
          ? { ...booking, status: actionType }
          : booking
      ));

      setActionDialogOpen(false);
      showAlert(`Booking ${actionType} successfully`, 'success');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${actionType} booking`);
      showAlert(`Failed to ${actionType} booking`, 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'primary';
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
      case 'completed':
        return <CheckCircle />;
      default:
        return null;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredBookings = bookings.filter(booking => {
    if (!booking.event || !booking.user) return false;

    // Apply status filter
    if (filterStatus !== 'all' && booking.status !== filterStatus) {
      return false;
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.event.name.toLowerCase().includes(searchLower) ||
        booking.user.name.toLowerCase().includes(searchLower) ||
        booking.user.email.toLowerCase().includes(searchLower) ||
        booking.package.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply tab filter
    if (activeTab === 0) return true; // All bookings
    if (activeTab === 1) return booking.status === 'pending';
    if (activeTab === 2) return booking.status === 'confirmed';
    if (activeTab === 3) return booking.status === 'completed';
    if (activeTab === 4) return booking.status === 'cancelled';

    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();

    printWindow.document.write(`
      <html>
        <head>
          <title>Event Bookings Report - ${currentDate}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            h1, h2 {
              color: #1976d2;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .stats {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-bottom: 20px;
            }
            .stat-card {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 4px;
              min-width: 150px;
            }
            .stat-title {
              font-size: 14px;
              color: #666;
            }
            .stat-value {
              font-size: 18px;
              font-weight: bold;
            }
            .status-confirmed {
              color: #2e7d32;
            }
            .status-pending {
              color: #ed6c02;
            }
            .status-cancelled {
              color: #d32f2f;
            }
            .status-completed {
              color: #0288d1;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Event Bookings Report</h1>
            <p>Generated on: ${currentDate}</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-title">Total Bookings</div>
              <div class="stat-value">${stats.total}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Pending</div>
              <div class="stat-value">${stats.pending}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Confirmed</div>
              <div class="stat-value">${stats.confirmed}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Completed</div>
              <div class="stat-value">${stats.completed}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Cancelled</div>
              <div class="stat-value">${stats.cancelled}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Total Revenue</div>
              <div class="stat-value">${formatCurrency(stats.revenue)}</div>
            </div>
          </div>
          
          <h2>Booking Details</h2>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredBookings.map(booking => `
                <tr>
                  <td>${booking.event?.name || 'Event Deleted'}</td>
                  <td>${booking.user?.name || 'User Deleted'}<br><small>${booking.user?.email || 'N/A'}</small></td>
                  <td>${new Date(booking.eventDate).toLocaleDateString()}<br><small>${booking.guestCount} guests</small></td>
                  <td>${booking.package?.name || 'N/A'}<br><small>${booking.package?.duration || 'N/A'}</small></td>
                  <td>${formatCurrency(booking.totalAmount || 0)}</td>
                  <td class="status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Print Report</button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
    showAlert('Logged out successfully', 'success');
  };

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: theme.palette.background.default,
          mt: { xs: '56px', sm: '64px' },
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back! Here's what's happening with your events and bookings.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={fetchBookings}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                  }}
                >
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Total Bookings
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <EventIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    +{stats.recentBookings} this week
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Active Events
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      }}
                    >
                      <CategoryIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.activeEvents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Available for booking
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Pending Bookings
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                      }}
                    >
                      <Pending />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Require attention
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Total Revenue
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <PaymentIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {formatCurrency(stats.revenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    From confirmed bookings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Bookings Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Recent Bookings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => {/* Handle export */ }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Box>
          </Box>

          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flexGrow: 1, minWidth: '250px', display: 'flex', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 1, px: 2, py: 1 }}>
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <input
                type="text"
                placeholder="Search by event, customer, or package..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  fontFamily: theme.typography.fontFamily,
                }}
              />
            </Box>
            <FormControl sx={{ minWidth: '150px' }}>
              <Select
                value={filterStatus}
                onChange={handleFilterChange}
                displayEmpty
                startAdornment={<FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                sx={{ bgcolor: 'background.paper' }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Bookings Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : filteredBookings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No Bookings Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                There are no bookings to display at this time.
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} aria-label="bookings table">
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 600, minWidth: '200px' }}>Event</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: '180px' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: '150px' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: '150px' }}>Package</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: '120px' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: '120px' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: '120px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      sx={{
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.03),
                        },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={booking.event?.images?.[0]}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          >
                            <EventIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {booking.event?.name || 'Event Deleted'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.event?.type || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                            {booking.user?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {booking.user?.name || 'User Deleted'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.user?.email || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body1">
                              {new Date(booking.eventDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.guestCount} guests
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {booking.package?.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.package?.duration || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                          {formatCurrency(booking.totalAmount || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(booking.status)}
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/events/${booking.event?._id}`)}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Contact Customer">
                            <IconButton size="small" color="info">
                              <PhoneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Email">
                            <IconButton size="small" color="secondary">
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {booking.status === 'pending' && (
                            <>
                              <Tooltip title="Confirm Booking">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleActionClick(booking, 'confirmed')}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel Booking">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleActionClick(booking, 'cancelled')}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10],
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Confirm Action
            </Typography>
            <IconButton onClick={() => setActionDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[getStatusColor(actionType)]?.main || theme.palette.primary.main, 0.1),
                color: theme.palette[getStatusColor(actionType)]?.main || theme.palette.primary.main,
                mr: 2,
              }}
            >
              {getStatusIcon(actionType)}
            </Avatar>
            <Typography variant="h6">
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Booking
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Are you sure you want to {actionType} this booking?
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            This action will update the booking status to "{actionType}" and may trigger notifications to the customer.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={getStatusColor(actionType)}
            sx={{ px: 3 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 