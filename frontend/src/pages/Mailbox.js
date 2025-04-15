import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemButton,
    IconButton,
    Button,
    TextField,
    CircularProgress,
    Alert,
    useTheme,
    alpha,
    Divider,
    Badge,
    Tooltip,
    Menu,
    MenuItem,
    ListItemAvatar,
    Avatar,
    useMediaQuery,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Email as EmailIcon,
    MarkEmailRead as MarkEmailReadIcon,
    MarkEmailUnread as MarkEmailUnreadIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    MoreVert as MoreVertIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon,
    Subject as SubjectIcon,
    Message as MessageIcon,
    Archive as ArchiveIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Inbox as InboxIcon,
    Send as SendIcon,
    Drafts as DraftsIcon,
    Star as StarredIcon,
    Snooze as SnoozeIcon,
    Label as LabelIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';

const Mailbox = () => {
    const theme = useTheme();
    const { refreshUnreadCount } = useMessages();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to fetch messages');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                setError('Admin authentication required');
                return;
            }

            await axios.delete(`http://localhost:5000/api/messages/${id}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            setMessages(messages.filter(message => message._id !== id));
            if (selectedMessage?._id === id) {
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            setError(error.response?.data?.message || 'Failed to delete message');
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setError('Admin authentication required');
                return;
            }

            const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
            const response = await axios.patch(
                `http://localhost:5000/api/messages/${id}`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setMessages(messages.map(msg =>
                    msg._id === id ? { ...msg, status: newStatus } : msg
                ));
                refreshUnreadCount();
            }
        } catch (error) {
            console.error('Error updating message status:', error);
            setError(error.response?.data?.message || 'Failed to update message status');
        }
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedMessageId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMessageId(null);
    };

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'unread' && message.status === 'unread') ||
            (filter === 'read' && message.status === 'read');
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        return status === 'unread' ? theme.palette.primary.main : theme.palette.text.secondary;
    };

    const renderSidebar = () => (
        <Paper
            sx={{
                height: '100%',
                borderRadius: 0,
                background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`
            }}
        >
            <List>
                <ListItemButton
                    sx={{
                        borderRadius: '8px',
                        mx: 1,
                        my: 0.5,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        }
                    }}
                >
                    <ListItemIcon>
                        <InboxIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Inbox"
                        primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: '0.95rem'
                        }}
                    />
                    <Badge
                        badgeContent={messages.filter(m => m.status === 'unread').length}
                        color="primary"
                        sx={{
                            '& .MuiBadge-badge': {
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: '20px',
                                minWidth: '20px',
                                padding: '0 6px'
                            }
                        }}
                    />
                </ListItemButton>
            </List>
        </Paper>
    );

    const renderMessageList = () => (
        <Paper
            sx={{
                height: '100%',
                borderRadius: 0,
                background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.background.paper, 0.95),
                    backdropFilter: 'blur(8px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search in messages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            },
                            '&.Mui-focused': {
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                            }
                        }
                    }}
                />
            </Box>
            <List sx={{ p: 0 }}>
                {filteredMessages.map((message) => (
                    <React.Fragment key={message._id}>
                        <ListItemButton
                            selected={selectedMessage?._id === message._id}
                            onClick={() => setSelectedMessage(message)}
                            sx={{
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                py: 1.5,
                                px: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                                '&.Mui-selected': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.16),
                                    }
                                }
                            }}
                        >
                            <ListItemIcon>
                                <IconButton
                                    size="small"
                                    sx={{
                                        color: message.status === 'unread'
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                        }
                                    }}
                                >
                                    {message.status === 'unread' ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
                                </IconButton>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: message.status === 'unread' ? 600 : 400,
                                            color: message.status === 'unread'
                                                ? theme.palette.text.primary
                                                : theme.palette.text.secondary,
                                            mb: 0.5
                                        }}
                                    >
                                        {message.subject}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {message.message}
                                    </Typography>
                                }
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    {format(new Date(message.createdAt), 'MMM d')}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMenuOpen(e, message._id);
                                    }}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                            color: theme.palette.primary.main
                                        }
                                    }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                        </ListItemButton>
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );

    const renderMessageContent = () => (
        <Paper
            sx={{
                height: '100%',
                borderRadius: 0,
                background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : theme.palette.background.paper,
                boxShadow: `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`
            }}
        >
            {selectedMessage ? (
                <Box sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                mb: 2
                            }}
                        >
                            {selectedMessage.subject}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                                p: 2,
                                borderRadius: '12px',
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 48,
                                    height: 48,
                                    fontSize: '1.2rem'
                                }}
                            >
                                {selectedMessage.name.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        mb: 0.5
                                    }}
                                >
                                    {selectedMessage.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    {selectedMessage.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '0.875rem'
                            }}
                        >
                            <AccessTimeIcon sx={{ fontSize: '1rem' }} />
                            {format(new Date(selectedMessage.createdAt), 'MMMM d, yyyy h:mm a')}
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            color: theme.palette.text.primary
                        }}
                    >
                        {selectedMessage.message}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                    background: alpha(theme.palette.background.paper, 0.8)
                }}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: 500
                        }}
                    >
                        Select a message to read
                    </Typography>
                </Box>
            )}
        </Paper>
    );

    if (loading) return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: alpha(theme.palette.background.paper, 0.8)
        }}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box sx={{ p: 3 }}>
            <Alert
                severity="error"
                sx={{
                    borderRadius: '12px',
                    boxShadow: `0 0 20px ${alpha(theme.palette.error.main, 0.1)}`
                }}
            >
                {error}
            </Alert>
        </Box>
    );

    return (
        <Box sx={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.default, 0.8)
                : alpha(theme.palette.background.default, 0.5)
        }}>
            {/* Sidebar */}
            <Box sx={{
                width: 256,
                borderRight: 1,
                borderColor: 'divider',
                display: { xs: 'none', sm: 'block' }
            }}>
                {renderSidebar()}
            </Box>

            {/* Main Content */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                {/* Message List */}
                <Box sx={{
                    width: { xs: '100%', sm: '35%' },
                    borderRight: { xs: 'none', sm: 1 },
                    borderBottom: { xs: 1, sm: 'none' },
                    borderColor: 'divider',
                    height: { xs: '40vh', sm: '100%' }
                }}>
                    {renderMessageList()}
                </Box>

                {/* Message Content */}
                <Box sx={{
                    width: { xs: '100%', sm: '65%' },
                    height: { xs: '60vh', sm: '100%' }
                }}>
                    {renderMessageContent()}
                </Box>
            </Box>

            {/* Message Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.1)}`,
                        minWidth: '200px'
                    }
                }}
            >
                <MenuItem
                    onClick={() => {
                        const message = messages.find(m => m._id === selectedMessageId);
                        if (message) {
                            setSelectedMessage(message);
                            handleMenuClose();
                        }
                    }}
                    sx={{
                        py: 1,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        }
                    }}
                >
                    <ListItemIcon>
                        <MessageIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText>View Message</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (selectedMessageId) {
                            const message = messages.find(m => m._id === selectedMessageId);
                            if (message) handleStatusChange(message._id, message.status);
                        }
                        handleMenuClose();
                    }}
                    sx={{
                        py: 1,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        }
                    }}
                >
                    <ListItemIcon>
                        {messages.find(m => m._id === selectedMessageId)?.status === 'unread' ?
                            <MarkEmailReadIcon fontSize="small" color="primary" /> :
                            <MarkEmailUnreadIcon fontSize="small" color="primary" />
                        }
                    </ListItemIcon>
                    <ListItemText>
                        {messages.find(m => m._id === selectedMessageId)?.status === 'unread' ?
                            'Mark as Read' :
                            'Mark as Unread'
                        }
                    </ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (selectedMessageId) handleDelete(selectedMessageId);
                        handleMenuClose();
                    }}
                    sx={{
                        py: 1,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.08),
                        }
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Mailbox; 