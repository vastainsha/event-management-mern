import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  Fade,
  Menu,
  MenuItem,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const storedAdminData = localStorage.getItem('adminData');
    setIsAdmin(!!adminToken);
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      setIsAdmin(false);
    } else {
      logout();
    }
    showAlert('Successfully logged out', 'success');
    navigate('/');
    setMobileOpen(false);
    setUserMenuAnchor(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const menuItems = [
    { text: 'Events', path: '/events', icon: <EventIcon /> },
    ...(user && !isAdmin
      ? [{ text: 'My Bookings', path: '/my-bookings', icon: <EventIcon /> }]
      : []),
    ...(isAdmin
      ? [{ text: 'Admin Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> }]
      : []),
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={scrolled ? 4 : 0}
      sx={{
        backgroundColor: 'white',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        boxShadow: scrolled 
          ? '0px 4px 20px rgba(0, 0, 0, 0.08)' 
          : 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1, minHeight: 70 }}>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: theme.palette.primary.main,
              fontFamily: theme.typography.h1.fontFamily,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: theme.palette.primary.dark,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <EventIcon sx={{ mr: 1, fontSize: '1.5rem' }} />
            Events & Vibes
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    width: '80%',
                    maxWidth: '300px',
                  },
                }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    Menu
                  </Typography>
                  <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider />
                <List>
                  {menuItems.map((item, index) => (
                    <React.Fragment key={item.text}>
                      <ListItem
                        button
                        component={RouterLink}
                        to={item.path}
                        onClick={handleDrawerToggle}
                        sx={{
                          py: 1.5,
                          transition: 'all 0.3s ease',
                          backgroundColor: isActive(item.path) 
                            ? alpha(theme.palette.primary.main, 0.08) 
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ 
                          color: isActive(item.path) 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary,
                          minWidth: '40px',
                        }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text}
                          sx={{
                            '& .MuiTypography-root': {
                              color: isActive(item.path) 
                                ? theme.palette.primary.main 
                                : theme.palette.text.primary,
                              fontWeight: isActive(item.path) ? 600 : 500,
                            },
                          }}
                        />
                      </ListItem>
                      {index < menuItems.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  
                  {!user && !isAdmin && (
                    <>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/login"
                        onClick={handleDrawerToggle}
                        sx={{
                          py: 1.5,
                          transition: 'all 0.3s ease',
                          backgroundColor: isActive('/login') 
                            ? alpha(theme.palette.primary.main, 0.08) 
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ 
                          color: isActive('/login') 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary,
                          minWidth: '40px',
                        }}>
                          <LoginIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Login"
                          sx={{
                            '& .MuiTypography-root': {
                              color: isActive('/login') 
                                ? theme.palette.primary.main 
                                : theme.palette.text.primary,
                              fontWeight: isActive('/login') ? 600 : 500,
                            },
                          }}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem
                        button
                        component={RouterLink}
                        to="/register"
                        onClick={handleDrawerToggle}
                        sx={{
                          py: 1.5,
                          transition: 'all 0.3s ease',
                          backgroundColor: isActive('/register') 
                            ? alpha(theme.palette.primary.main, 0.08) 
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ 
                          color: isActive('/register') 
                            ? theme.palette.primary.main 
                            : theme.palette.text.secondary,
                          minWidth: '40px',
                        }}>
                          <AppRegistrationIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Register"
                          sx={{
                            '& .MuiTypography-root': {
                              color: isActive('/register') 
                                ? theme.palette.primary.main 
                                : theme.palette.text.primary,
                              fontWeight: isActive('/register') ? 600 : 500,
                            },
                          }}
                        />
                      </ListItem>
                    </>
                  )}
                  
                  {(user || isAdmin) && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <ListItem
                        button
                        onClick={handleLogout}
                        sx={{
                          py: 1.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.08),
                            transform: 'translateX(5px)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: '40px' }}>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Logout"
                          sx={{
                            '& .MuiTypography-root': {
                              color: theme.palette.error.main,
                              fontWeight: 500,
                            },
                          }}
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="primary"
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ 
                    fontWeight: 500,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: isActive(item.path) ? '100%' : '0%',
                      height: '2px',
                      bottom: '0',
                      left: '0',
                      backgroundColor: theme.palette.primary.main,
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&:after': {
                        width: '100%',
                      },
                    },
                    color: isActive(item.path) 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary,
                  }}
                >
                  {item.text}
                </Button>
              ))}
              
              {(user || isAdmin) ? (
                <Tooltip title="Account" arrow TransitionComponent={Fade}>
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      ml: 1,
                      transition: 'all 0.3s ease',
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        border: `2px solid ${theme.palette.primary.main}`,
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.9rem',
                      }}
                    >
                      {isAdmin ? (adminData?.name ? adminData.name.charAt(0).toUpperCase() : 'A') : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  {!isAdmin && (
                    <>
                      <Button
                        color="primary"
                        component={RouterLink}
                        to="/login"
                        startIcon={<LoginIcon />}
                        sx={{ 
                          fontWeight: 500,
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: isActive('/login') ? '100%' : '0%',
                            height: '2px',
                            bottom: '0',
                            left: '0',
                            backgroundColor: theme.palette.primary.main,
                            transition: 'width 0.3s ease',
                          },
                          '&:hover': {
                            backgroundColor: 'transparent',
                            '&:after': {
                              width: '100%',
                            },
                          },
                          color: isActive('/login') 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary,
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/register"
                        startIcon={<AppRegistrationIcon />}
                        sx={{ 
                          borderRadius: '20px',
                          px: 2,
                          py: 1,
                          boxShadow: '0px 4px 10px rgba(91, 143, 185, 0.2)',
                          '&:hover': {
                            boxShadow: '0px 6px 15px rgba(91, 143, 185, 0.3)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </>
              )}
              
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                TransitionComponent={Fade}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                    minWidth: '200px',
                    mt: 1,
                  },
                }}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {isAdmin ? (adminData?.name ? adminData.name.charAt(0).toUpperCase() : 'A') : (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {isAdmin ? (adminData?.name || 'Admin') : (user?.name || 'User')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isAdmin ? (adminData?.email || '') : (user?.email || '')}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                {!isAdmin && (
                  <MenuItem 
                    onClick={() => {
                      navigate('/my-bookings');
                      handleUserMenuClose();
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon>
                      <EventIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>My Bookings</ListItemText>
                  </MenuItem>
                )}
                <MenuItem 
                  onClick={() => {
                    handleLogout();
                    handleUserMenuClose();
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 