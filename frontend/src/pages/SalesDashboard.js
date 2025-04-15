import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  TextField
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TrendingUp,
  TrendingDown,
  CalendarMonth,
  CalendarToday,
  ShowChart
} from '@mui/icons-material';
import axios from 'axios';

const COLORS = {
  birthday: '#0088FE',
  wedding: '#00C49F',
  anniversary: '#FFBB28',
  corporate: '#FF8042',
  custom: '#8884D8'
};

const getCategoryLabel = (category) => {
  const labels = {
    birthday: 'Birthday Events',
    wedding: 'Wedding Events',
    anniversary: 'Anniversary Events',
    corporate: 'Corporate Events',
    custom: 'Custom Events'
  };
  return labels[category] || category;
};

const getCategoryColor = (category) => {
  return COLORS[category] || '#8884D8'; // Default color if category not found
};

const SalesDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchSalesData();
  }, [timeRange, startDate, endDate]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      let url = `http://localhost:5000/api/admin/sales?timeRange=${timeRange}`;
      
      if (startDate && endDate) {
        url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalesData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  const getGrowthIndicator = (value, previousValue) => {
    if (!previousValue) return null;
    const growth = ((value - previousValue) / previousValue) * 100;
    return (
      <Box display="flex" alignItems="center" ml={1}>
        {growth >= 0 ? (
          <TrendingUp sx={{ color: 'success.main' }} />
        ) : (
          <TrendingDown sx={{ color: 'error.main' }} />
        )}
        <Typography
          variant="body2"
          color={growth >= 0 ? 'success.main' : 'error.main'}
          ml={0.5}
        >
          {Math.abs(growth).toFixed(1)}%
        </Typography>
      </Box>
    );
  };

  const StatCard = ({ title, value, previousValue, subtitle, icon, color }) => (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(
          color,
          0.05
        )} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        {icon}
      </Box>
      <Box display="flex" alignItems="baseline">
        <Typography variant="h4" color="text.primary">
          {title === 'Total Bookings' 
            ? value?.toLocaleString('en-US')
            : typeof value === 'number' 
              ? value.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
              : value}
        </Typography>
        {getGrowthIndicator(value, previousValue)}
      </Box>
      <Typography variant="body2" color="text.secondary" mt={1}>
        {subtitle}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={{ xs: 2, sm: 3 }}>
        {/* Header */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          gap={2}
          mb={4}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Event Type Sales Analytics
          </Typography>
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <FormControl fullWidth>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small'
                  }
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
                fullWidth
              >
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Sales"
              value={salesData?.totalSales}
              previousValue={salesData?.previousTotalSales}
              subtitle="Total revenue generated"
              icon={<ShowChart color="primary" />}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Bookings"
              value={salesData?.totalBookings}
              previousValue={salesData?.previousTotalBookings}
              subtitle="Number of confirmed bookings"
              icon={<CalendarMonth color="secondary" />}
              color={theme.palette.secondary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Average Booking Value"
              value={salesData?.averageBookingValue}
              previousValue={salesData?.previousAverageBookingValue}
              subtitle="Average revenue per booking"
              icon={<CalendarToday color="success" />}
              color={theme.palette.success.main}
            />
          </Grid>
        </Grid>

        {/* Category Sales Pie Chart */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Sales Distribution by Event Type
              </Typography>
              <Box height={{ xs: 300, sm: 400, md: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesData?.categorySales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={{ xs: 100, sm: 150, md: 200 }}
                      fill="#8884d8"
                      dataKey="sales"
                      nameKey="category"
                      label={({ name, percent }) => `${getCategoryLabel(name)} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {salesData?.categorySales?.map((entry) => (
                        <Cell key={`cell-${entry.category}`} fill={getCategoryColor(entry.category)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [
                        value.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        }),
                        'Sales'
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Event Type Details
              </Typography>
              <Box sx={{ maxHeight: { xs: 300, sm: 400, md: 500 }, overflow: 'auto' }}>
                {salesData?.categorySales?.map((category) => {
                  const categoryColor = getCategoryColor(category.category);
                  return (
                    <Box
                      key={category.category}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        backgroundColor: alpha(categoryColor, 0.1),
                        borderLeft: `4px solid ${categoryColor}`
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {getCategoryLabel(category.category)}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {category.sales.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.bookings} bookings
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average: {category.bookings > 0 
                          ? (category.sales / category.bookings).toLocaleString('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0
                            })
                          : '₹0'}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default SalesDashboard; 