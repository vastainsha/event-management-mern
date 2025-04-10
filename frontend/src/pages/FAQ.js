import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Paper,
    useTheme,
    alpha,
    Grid,
    IconButton,
    Tooltip,
    Fade,
    keyframes,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CategoryIcon from '@mui/icons-material/Category';
import { styled } from '@mui/material/styles';

// Animations
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

// Styled Components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px !important',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    '&:before': {
        display: 'none',
    },
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    '& .MuiAccordionSummary-content': {
        margin: '16px 0',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: theme.palette.primary.main,
        transition: 'transform 0.3s ease',
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(180deg)',
    },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    marginBottom: theme.spacing(4),
    '& .MuiTextField-root': {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
            },
            '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
        },
    },
    '& .search-icon': {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        color: theme.palette.primary.main,
        animation: `${pulse} 2s infinite ease-in-out`,
    },
}));

const CategoryChip = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    fontWeight: 600,
    marginRight: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        fontSize: '1rem',
        marginRight: theme.spacing(0.5),
    },
}));

const FAQ = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        {
            category: 'General',
            question: 'What is Events & Vibes?',
            answer: 'Events & Vibes is a comprehensive event management platform that helps you discover, book, and manage various events. From concerts to workshops, we make event planning and attendance seamless.',
        },
        {
            category: 'Booking',
            question: 'How do I book an event?',
            answer: 'To book an event, simply browse our events page, select your desired event, choose your tickets, and proceed to checkout. You can pay securely using various payment methods including credit cards and digital wallets.',
        },
        {
            category: 'Payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express), digital wallets (PayPal, Google Pay, Apple Pay), and bank transfers. All payments are processed securely through our encrypted payment gateway.',
        },
        {
            category: 'Refunds',
            question: 'What is your refund policy?',
            answer: 'We offer refunds up to 48 hours before the event start time. Refunds are processed within 5-7 business days. For events cancelled by the organizer, full refunds are automatically processed.',
        },
        {
            category: 'Technical',
            question: 'How do I access my booked events?',
            answer: 'You can access your booked events through your account dashboard under "My Bookings". Each booking comes with a unique QR code that you can show at the event venue for quick check-in.',
        },
        {
            category: 'Support',
            question: 'How can I get help with my booking?',
            answer: 'Our customer support team is available 24/7 through live chat, email, or phone. You can also check your booking status and manage your tickets through your account dashboard.',
        },
    ];

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <HelpOutlineIcon
                            sx={{
                                fontSize: 50,
                                color: '#ffffff',
                                animation: `${pulse} 2s infinite ease-in-out`,
                            }}
                        />
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
                        Frequently Asked Questions
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
                        Find answers to common questions about our platform, bookings, and services
                    </Typography>
                </Box>
            </Box>

            {/* Search Section */}
            <SearchWrapper>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon
                                sx={{
                                    mr: 1,
                                    color: '#5B8FB9',
                                }}
                            />
                        ),
                    }}
                />
            </SearchWrapper>

            {/* FAQ Section */}
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {filteredFaqs.map((faq, index) => (
                    <Fade
                        in={true}
                        timeout={500}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        key={faq.question}
                    >
                        <StyledAccordion
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                        >
                            <StyledAccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryChip>
                                            <CategoryIcon fontSize="small" />
                                            {faq.category}
                                        </CategoryChip>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.text.primary,
                                            }}
                                        >
                                            {faq.question}
                                        </Typography>
                                    </Box>
                                </Box>
                            </StyledAccordionSummary>
                            <StyledAccordionDetails>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.7 }}
                                >
                                    {faq.answer}
                                </Typography>
                            </StyledAccordionDetails>
                        </StyledAccordion>
                    </Fade>
                ))}

                {filteredFaqs.length === 0 && (
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            animation: `${fadeIn} 0.5s ease-out`,
                            background: '#5B8FB9',
                            borderRadius: '16px',
                            boxShadow: `0 4px 20px ${alpha('#5B8FB9', 0.3)}`,
                            color: '#ffffff',
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#ffffff' }} gutterBottom>
                            No results found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffff' }}>
                            Try adjusting your search terms or browse through our categories
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default FAQ; 