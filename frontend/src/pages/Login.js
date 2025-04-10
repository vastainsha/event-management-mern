import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
  Slide,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('user');
  const [showForm, setShowForm] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginTypeChange = (event, newLoginType) => {
    if (newLoginType !== null && newLoginType !== loginType) {
      // Animate out
      setShowForm(false);
      
      // Wait for animation to complete before changing type
      setTimeout(() => {
        setLoginType(newLoginType);
        // Animate in
        setShowForm(true);
      }, 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Attempting login as:', loginType); // Debug log

    try {
      if (loginType === 'user') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          showAlert('Login successful', 'success');
          navigate('/');
        } else {
          throw new Error(result.message);
        }
      } else {
        console.log('Attempting admin login...'); // Debug log
        const response = await axios.post(
          'http://localhost:5000/api/admin/login',
          {
            email: formData.email,
            password: formData.password
          }
        );

        console.log('Admin login response:', response.data); // Debug log

        if (response.data && response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('adminData', JSON.stringify(response.data.admin));
          showAlert('Admin login successful', 'success');
          navigate('/admin/dashboard');
        } else {
          throw new Error('Invalid response from server');
        }
      }
    } catch (err) {
      console.error('Login error:', err.response || err); // Enhanced error logging
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      showAlert(`Login failed: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {loginType === 'admin' ? 'Admin Login' : 'User Login'}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup
              value={loginType}
              exclusive
              onChange={handleLoginTypeChange}
              aria-label="login type"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 3,
                  py: 1,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                },
              }}
            >
              <ToggleButton value="user" aria-label="user login">
                <PersonIcon sx={{ mr: 1 }} />
                User Login
              </ToggleButton>
              <ToggleButton value="admin" aria-label="admin login">
                <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                Admin Login
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Fade in={showForm}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}, transparent)`,
                    transform: 'translateX(-100%)',
                    animation: 'shimmer 2s infinite',
                  },
                  '@keyframes shimmer': {
                    '100%': {
                      transform: 'translateX(100%)',
                    },
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Box>
          </Fade>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 