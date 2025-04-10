import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Avatar,
    Paper,
    Divider,
    useTheme,
    alpha,
    keyframes,
    Fade,
} from '@mui/material';
import {
    Event,
    People,
    EmojiEvents,
    Security,
    Timeline,
    LocationOn,
    Phone,
    Email,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Define keyframes for animations
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

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const FeatureCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    background: '#5B8FB9',
    color: '#ffffff',
    boxShadow: `0 8px 32px ${alpha('#5B8FB9', 0.3)}`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 40px ${alpha('#5B8FB9', 0.4)}`,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 40,
        marginBottom: theme.spacing(2),
        animation: `${pulse} 2s infinite ease-in-out`,
    },
}));

const TeamCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    background: alpha(theme.palette.background.paper, 0.8),
    boxShadow: `0 8px 32px ${alpha('#5B8FB9', 0.2)}`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 40px ${alpha('#5B8FB9', 0.3)}`,
    },
    '& .MuiAvatar-root': {
        width: 120,
        height: 120,
        marginBottom: theme.spacing(2),
        border: `4px solid ${alpha('#5B8FB9', 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
            border: `4px solid ${alpha('#5B8FB9', 0.6)}`,
            transform: 'scale(1.05)',
        },
    },
}));

const StatCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    background: alpha(theme.palette.background.paper, 0.8),
    boxShadow: `0 8px 32px ${alpha('#5B8FB9', 0.2)}`,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 40px ${alpha('#5B8FB9', 0.3)}`,
    },
}));

const AboutUs = () => {
    const theme = useTheme();

    const features = [
        {
            icon: <Event fontSize="large" />,
            title: 'Event Management',
            description: 'Comprehensive event planning and management solutions for all types of events.',
        },
        {
            icon: <People fontSize="large" />,
            title: 'Expert Team',
            description: 'Our experienced team ensures smooth execution of your events.',
        },
        {
            icon: <EmojiEvents fontSize="large" />,
            title: 'Quality Service',
            description: 'Commitment to delivering exceptional service and memorable experiences.',
        },
        {
            icon: <Security fontSize="large" />,
            title: 'Secure Platform',
            description: 'Safe and secure platform for managing your events and bookings.',
        },
    ];

    const team = [
        {
            name: 'Aditya Maksare',
            role: 'CEO & Co-Founder',
            image: 'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortWaved&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=Blue&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light',
            bio: 'With extensive experience in event management and technology, Aditya leads the company with innovative vision and strategic direction.',
        },
        {
            name: 'Insha Vasta',
            role: 'CEO & Co-Founder',
            image: 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=PastelRed&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light',
            bio: 'Insha brings creativity and business acumen to the company, ensuring Events & Vibes delivers exceptional experiences to all clients.',
        },
    ];

    const stats = [
        { number: '500+', label: 'Events Managed' },
        { number: '50K+', label: 'Happy Attendees' },
        { number: '98%', label: 'Success Rate' },
        { number: '24/7', label: 'Support' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    mb: 8,
                    animation: `${fadeIn} 0.8s ease-out`,
                    position: 'relative',
                    background: '#5B8FB9',
                    borderRadius: '24px',
                    padding: '40px 20px',
                    boxShadow: `0 8px 32px ${alpha('#5B8FB9', 0.3)}`,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at center, ${alpha('#ffffff', 0.1)} 0%, transparent 70%)`,
                        borderRadius: '24px',
                        zIndex: 0,
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(45deg, ${alpha('#5B8FB9', 0.8)}, ${alpha('#5B8FB9', 0.9)})`,
                        borderRadius: '24px',
                        zIndex: 0,
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            backgroundColor: alpha('#ffffff', 0.2),
                            mb: 3,
                            animation: `${float} 3s infinite ease-in-out`,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -5,
                                left: -5,
                                right: -5,
                                bottom: -5,
                                borderRadius: '50%',
                                background: `linear-gradient(45deg, ${alpha('#ffffff', 0.3)}, ${alpha('#ffffff', 0.4)})`,
                                zIndex: -1,
                                animation: `${pulse} 2s infinite ease-in-out`,
                            },
                        }}
                    >
                        <People fontSize="large" sx={{ color: '#ffffff' }} />
                    </Box>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: '#ffffff',
                            textShadow: `0 2px 10px ${alpha('#000000', 0.3)}`,
                            mb: 2,
                        }}
                    >
                        About Us
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            maxWidth: 600,
                            mx: 'auto',
                            mb: 4,
                            position: 'relative',
                            color: '#ffffff',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 100,
                                height: 2,
                                background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.6)}, transparent)`,
                            },
                        }}
                    >
                        Learn more about our mission, team, and what drives us
                    </Typography>
                </Box>
            </Box>

            {/* Stats Section */}
            <Box sx={{ mb: 8 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true} timeout={500}>
                            <StatCard>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#5B8FB9', mb: 1 }}>
                                    500+
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Events Created
                                </Typography>
                            </StatCard>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true} timeout={700}>
                            <StatCard>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#5B8FB9', mb: 1 }}>
                                    10K+
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Happy Customers
                                </Typography>
                            </StatCard>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true} timeout={900}>
                            <StatCard>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#5B8FB9', mb: 1 }}>
                                    50+
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Event Categories
                                </Typography>
                            </StatCard>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in={true} timeout={1100}>
                            <StatCard>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#5B8FB9', mb: 1 }}>
                                    24/7
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Customer Support
                                </Typography>
                            </StatCard>
                        </Fade>
                    </Grid>
                </Grid>
            </Box>

            {/* Mission Statement */}
            <Box sx={{ mb: 8 }}>
                <Fade in={true} timeout={1300}>
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: '16px',
                            boxShadow: `0 8px 32px ${alpha('#5B8FB9', 0.2)}`,
                            background: alpha(theme.palette.background.paper, 0.8),
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: '#5B8FB9',
                                textAlign: 'center',
                                mb: 3,
                            }}
                        >
                            Our Mission
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                textAlign: 'center',
                                color: 'text.secondary',
                            }}
                        >
                            At Events & Vibes, our mission is to connect people through unforgettable experiences.
                            We believe that events have the power to bring communities together, spark creativity,
                            and create lasting memories. By providing a seamless platform for event discovery,
                            booking, and management, we aim to make event planning accessible to everyone.
                        </Typography>
                    </Paper>
                </Fade>
            </Box>

            {/* Features Section */}
            <Box sx={{ mb: 8 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#5B8FB9',
                        textAlign: 'center',
                        mb: 4,
                    }}
                >
                    What We Offer
                </Typography>
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Fade in={true} timeout={1500 + index * 200}>
                                <FeatureCard>
                                    {feature.icon}
                                    <Typography variant="h6" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        {feature.description}
                                    </Typography>
                                </FeatureCard>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Team Section */}
            <Box>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: '#5B8FB9',
                        textAlign: 'center',
                        mb: 4,
                    }}
                >
                    Meet Our Team
                </Typography>
                <Grid container spacing={4}>
                    {team.map((member, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Fade in={true} timeout={2300 + index * 200}>
                                <TeamCard>
                                    <Avatar
                                        alt={member.name}
                                        src={member.image}
                                        sx={{ width: 120, height: 120 }}
                                    />
                                    <Typography variant="h5" gutterBottom>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        {member.role}
                                    </Typography>
                                    <Divider sx={{ my: 2, width: '50%' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {member.bio}
                                    </Typography>
                                </TeamCard>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default AboutUs; 