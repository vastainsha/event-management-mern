import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5B8FB9', // Soft blue
      light: '#7BA7C9',
      dark: '#4A7A9E',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7C9A92', // Sage green
      light: '#9AB5AE',
      dark: '#6A827A',
      contrastText: '#fff',
    },
    accent: {
      main: '#BFA2DB', // Soft lavender
      light: '#D0B8E3',
      dark: '#A88BC9',
      contrastText: '#000',
    },
    background: {
      default: '#F5F5F5', // Light gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333', // Dark gray (not pure black)
      secondary: '#666666', // Medium gray
    },
    error: {
      main: '#D88C9A', // Soft red
      light: '#E3A5B0',
      dark: '#C37384',
    },
    success: {
      main: '#8FB9A2', // Soft green
      light: '#A7C9B7',
      dark: '#7AA38C',
    },
    warning: {
      main: '#D4B483', // Soft orange
      light: '#DFC59A',
      dark: '#C9A36C',
    },
    info: {
      main: '#8BA6CF', // Soft blue
      light: '#A5BBDA',
      dark: '#7A91B9',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          fontSize: '0.95rem',
          letterSpacing: '0.5px',
          boxShadow: 'none',
        },
        contained: {
          background: 'linear-gradient(145deg, #5B8FB9, #4A7A9E)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(145deg, #7BA7C9, #5B8FB9)',
            boxShadow: '0px 4px 8px rgba(91, 143, 185, 0.3)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            background: 'linear-gradient(145deg, #4A7A9E, #3A6A8E)',
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            background: 'linear-gradient(145deg, #B0C4D9, #A0B4C9)',
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#5B8FB9',
          color: '#5B8FB9',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: '#7BA7C9',
            backgroundColor: 'rgba(91, 143, 185, 0.08)',
            color: '#4A7A9E',
          },
          '&:active': {
            borderColor: '#4A7A9E',
            backgroundColor: 'rgba(91, 143, 185, 0.12)',
          },
          '&.Mui-disabled': {
            borderColor: '#B0C4D9',
            color: 'rgba(91, 143, 185, 0.5)',
          },
        },
        text: {
          color: '#5B8FB9',
          '&:hover': {
            backgroundColor: 'rgba(91, 143, 185, 0.08)',
            color: '#4A7A9E',
          },
          '&:active': {
            backgroundColor: 'rgba(91, 143, 185, 0.12)',
          },
          '&.Mui-disabled': {
            color: 'rgba(91, 143, 185, 0.5)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.85rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1.05rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(91, 143, 185, 0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7BA7C9', // primary.light
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#5B8FB9', // primary.main
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#5B8FB9', // primary.main
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#4A7A9E', // primary.dark
            textDecoration: 'none',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(91, 143, 185, 0.08)', // primary with opacity
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(91, 143, 185, 0.08)', // primary with opacity
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            color: '#5B8FB9', // primary.main
          },
          '&:hover': {
            color: '#7BA7C9', // primary.light
          },
        },
      },
    },
  },
});

export default theme; 