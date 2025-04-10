import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    useTheme,
    alpha,
    keyframes,
    Snackbar,
    Alert,
    Fade,
    Divider,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Paper,
} from '@mui/material';
import {
    LocationOn,
    Phone,
    Email,
    Send,
    AccessTime,
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    ContactSupport,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: alpha('#ffffff', 0.9),
        },
        '&.Mui-focused': {
            backgroundColor: 'white',
            boxShadow: `0 0 0 2px ${alpha('#5B8FB9', 0.2)}`,
        },
        '& .MuiOutlinedInput-input': {
            color: 'text.primary',
            padding: '16px 14px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#5B8FB9', 0.2),
            borderWidth: '2px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#5B8FB9', 0.4),
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5B8FB9',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'text.secondary',
        '&.Mui-focused': {
            color: '#5B8FB9',
        },
    },
    '& .MuiInputLabel-shrink': {
        color: '#5B8FB9',
    },
}));

const FormCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: `0 8px 32px ${alpha('#000000', 0.1)}`,
    height: '100%',
    border: `1px solid ${alpha('#5B8FB9', 0.1)}`,
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: `linear-gradient(90deg, ${alpha('#5B8FB9', 0.8)}, ${alpha('#5B8FB9', 0.4)})`,
    },
}));

const ContactCard = styled(Paper)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    boxShadow: `0 4px 20px ${alpha('#000000', 0.1)}`,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    padding: theme.spacing(1.5),
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 30px ${alpha('#000000', 0.2)}`,
        background: 'rgba(255, 255, 255, 0.15)',
    },
    '& .MuiSvgIcon-root': {
        fontSize: 24,
        marginBottom: theme.spacing(1),
        color: 'white',
        animation: `${pulse} 2s infinite ease-in-out`,
    },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
        color: alpha('#ffffff', 0.8),
        transform: 'translateY(-3px)',
    },
}));

const ContactUs = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setOpenSnackbar(true);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <ContactSupport
                    sx={{
                        fontSize: 60,
                        color: '#5B8FB9',
                        mb: 2,
                        animation: `${pulse} 2s infinite ease-in-out`,
                    }}
                />
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#5B8FB9',
                        textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        mb: 1,
                    }}
                >
                    Contact Us
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        color: 'text.secondary',
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: 4,
                    }}
                >
                    Have questions or need assistance? We're here to help you with any inquiries about our events and services.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Fade in={true} timeout={800}>
                        <FormCard>
                            <Box
                                sx={{
                                    p: 3,
                                    background: `linear-gradient(135deg, ${alpha('#5B8FB9', 0.05)}, ${alpha('#5B8FB9', 0.1)})`,
                                    borderBottom: `1px solid ${alpha('#5B8FB9', 0.1)}`,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        color: '#5B8FB9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Send sx={{ fontSize: 24 }} />
                                    Send Us a Message
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </Typography>
                            </Box>
                            <CardContent sx={{ p: 3 }}>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Your Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                fullWidth
                                                label="Subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                multiline
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                endIcon={<Send />}
                                                sx={{
                                                    mt: 1,
                                                    py: 1.5,
                                                    px: 4,
                                                    borderRadius: '12px',
                                                    backgroundColor: '#5B8FB9',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    boxShadow: `0 4px 14px ${alpha('#5B8FB9', 0.3)}`,
                                                    '&:hover': {
                                                        backgroundColor: '#5B8FB9',
                                                        boxShadow: `0 6px 20px ${alpha('#5B8FB9', 0.4)}`,
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                Send Message
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </FormCard>
                    </Fade>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Fade in={true} timeout={1000}>
                        <Box
                            className="MuiBox-root css-3b2wtl"
                            sx={{
                                height: '100%',
                                background: '#5B8FB9',
                                borderRadius: '12px',
                                p: 2,
                                color: 'white',
                                boxShadow: `0 4px 20px ${alpha('#5B8FB9', 0.3)}`,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
                                Get In Touch
                            </Typography>
                            <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={4}>
                                    <ContactCard>
                                        <Email />
                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                                            Email Us
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                            info@eventsandvibes.com
                                        </Typography>
                                    </ContactCard>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ContactCard>
                                        <Phone />
                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                                            Call Us
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                            +91 98765 43210
                                        </Typography>
                                    </ContactCard>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <ContactCard>
                                        <LocationOn />
                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                                            Visit Us
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                            123, Koregaon Park<br />
                                            Pune, Maharashtra 411001<br />
                                            India
                                        </Typography>
                                    </ContactCard>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: `1px solid ${alpha('#ffffff', 0.2)}`,
                                            height: '100%',
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
                                                Business Hours
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <AccessTime sx={{ color: 'white', mr: 1, fontSize: 16 }} />
                                                <Typography variant="body2" sx={{ color: 'white' }}>Mon-Fri: 9:00 AM - 6:00 PM</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <AccessTime sx={{ color: 'white', mr: 1, fontSize: 16 }} />
                                                <Typography variant="body2" sx={{ color: 'white' }}>Sat: 10:00 AM - 4:00 PM</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <AccessTime sx={{ color: 'white', mr: 1, fontSize: 16 }} />
                                                <Typography variant="body2" sx={{ color: 'white' }}>Sun: Closed</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: `1px solid ${alpha('#ffffff', 0.2)}`,
                                            height: '100%',
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
                                                Connect With Us
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
                                                <Tooltip title="Facebook">
                                                    <SocialIconButton>
                                                        <Facebook />
                                                    </SocialIconButton>
                                                </Tooltip>
                                                <Tooltip title="Twitter">
                                                    <SocialIconButton>
                                                        <Twitter />
                                                    </SocialIconButton>
                                                </Tooltip>
                                                <Tooltip title="Instagram">
                                                    <SocialIconButton>
                                                        <Instagram />
                                                    </SocialIconButton>
                                                </Tooltip>
                                                <Tooltip title="LinkedIn">
                                                    <SocialIconButton>
                                                        <LinkedIn />
                                                    </SocialIconButton>
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Card
                                sx={{
                                    mt: 2,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: `1px solid ${alpha('#ffffff', 0.2)}`,
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '60px',
                                        background: `linear-gradient(45deg, ${alpha('#ffffff', 0.1)}, ${alpha('#ffffff', 0.2)})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <LocationOn sx={{ fontSize: 24, color: 'white' }} />
                                </Box>
                                <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                                        Events & Vibes Headquarters
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        Located in Koregaon Park, Pune. Your one-stop platform for discovering and booking amazing events.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%', borderRadius: '8px' }}
                >
                    Your message has been sent successfully! We'll get back to you soon.
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ContactUs; 