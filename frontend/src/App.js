import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import theme from './theme';
import './styles/global.css';
import AdminLogin from './pages/AdminLogin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Mailbox from './pages/Mailbox';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <AuthProvider>
          <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Navbar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  pt: { xs: 8, sm: 9 },
                  minHeight: '100vh',
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route
                    path="/booking/:eventId"
                    element={
                      <PrivateRoute>
                        <Booking />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <PrivateRoute>
                        <MyBookings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/mailbox"
                    element={
                      <ProtectedAdminRoute>
                        <Mailbox />
                      </ProtectedAdminRoute>
                    }
                  />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
