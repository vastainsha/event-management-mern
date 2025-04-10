import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { MessageProvider } from './context/MessageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import AboutUs from './pages/AboutUs';
import Contact from './pages/ContactUs';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';
import Mailbox from './pages/Mailbox';
import theme from './theme';

// Placeholder components for missing admin pages
const AdminEvents = () => <div>Admin Events Page</div>;
const AdminBookings = () => <div>Admin Bookings Page</div>;
const AdminUsers = () => <div>Admin Users Page</div>;
const AdminSettings = () => <div>Admin Settings Page</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AlertProvider>
          <MessageProvider>
            <Router>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/events" element={<AdminEvents />} />
                    <Route path="/admin/bookings" element={<AdminBookings />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/admin/mailbox" element={<Mailbox />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </MessageProvider>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
