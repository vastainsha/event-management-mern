import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Button,
    TextField,
    CircularProgress,
    Alert,
    useTheme,
    alpha,
    Fade,
    Zoom,
    Chip,
    Divider,
    Badge,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

const Mailbox = () => {
    const theme = useTheme();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [success, setSuccess] = useState(null);

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

            // Ensure the ID is a valid MongoDB ObjectId
            if (!id || typeof id !== 'string' || id.length !== 24) {
                setError('Invalid message ID');
                return;
            }

            await axios.delete(`http://localhost:5000/api/messages/${id}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            // Update the messages list after successful deletion
            setMessages(messages.filter(message => message._id !== id));
            setSuccess('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            setError(error.response?.data?.message || 'Failed to delete message. Please try again.');
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
            await axios.patch(`http://localhost:5000/api/messages/${id}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setMessages(messages.map(msg => 
                msg._id === id ? { ...msg, status: newStatus } : msg
            ));
        } catch (error) {
            console.error('Error updating message status:', error);
            setError('Failed to update message status');
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

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        handleMenuClose();
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

    const renderMessageCard = (message, index) => (
        <Zoom in={true} timeout={300 + index * 100} key={message._id}>
            <Card 
                elevation={0}
                sx={{ 
                    mb: 2,
                    borderRadius: '16px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                    }
                }}
            >
                <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Badge
                                color="primary"
                                variant="dot"
                                invisible={message.status !== 'unread'}
                                sx={{ mr: 1 }}
                            >
                                <Avatar 
                                    sx={{ 
                                        bgcolor: alpha(getStatusColor(message.status), 0.1),
                                        color: getStatusColor(message.status),
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    {message.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </Badge>
                            <Box>
                                <Typography variant="subtitle1" sx={{ 
                                    fontWeight: message.status === 'unread' ? 600 : 400,
                                    color: message.status === 'unread' ? 
                                        theme.palette.text.primary : 
                                        theme.palette.text.secondary,
                                }}>
                                    {message.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {message.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                {format(new Date(message.createdAt), 'MMM d, yyyy')}
                            </Typography>
                            <IconButton 
                                size="small" 
                                onClick={(e) => handleMenuOpen(e, message._id)}
                                sx={{ color: 'text.secondary' }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 1,
                            fontWeight: message.status === 'unread' ? 600 : 500,
                            color: message.status === 'unread' ? 
                                theme.palette.text.primary : 
                                theme.palette.text.secondary,
                        }}
                    >
                        {message.subject}
                    </Typography>
                    
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {message.message}
                    </Typography>
                </CardContent>
                
                <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
                    <Box>
                        <Chip 
                            size="small" 
                            label={message.status === 'unread' ? 'Unread' : 'Read'} 
                            color={message.status === 'unread' ? 'primary' : 'default'}
                            variant={message.status === 'unread' ? 'filled' : 'outlined'}
                            sx={{ mr: 1 }}
                        />
                    </Box>
                    <Box>
                        <Tooltip title={message.status === 'unread' ? 'Mark as read' : 'Mark as unread'}>
                            <IconButton
                                size="small"
                                onClick={() => handleStatusChange(message._id, message.status)}
                                sx={{
                                    color: getStatusColor(message.status),
                                    '&:hover': {
                                        backgroundColor: alpha(getStatusColor(message.status), 0.1),
                                    }
                                }}
                            >
                                {message.status === 'unread' ? <MarkEmailReadIcon /> : <MarkEmailUnreadIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete message">
                            <IconButton
                                size="small"
                                onClick={() => handleDelete(message._id)}
                                sx={{
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardActions>
            </Card>
        </Zoom>
    );

    const renderMessageList = (message, index) => (
        <Zoom in={true} timeout={300 + index * 100} key={message._id}>
            <Paper
                elevation={0}
                sx={{
                    mb: 1,
                    borderRadius: '12px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Badge
                        color="primary"
                        variant="dot"
                        invisible={message.status !== 'unread'}
                        sx={{ mr: 2 }}
                    >
                        <Avatar 
                            sx={{ 
                                bgcolor: alpha(getStatusColor(message.status), 0.1),
                                color: getStatusColor(message.status),
                                width: 36,
                                height: 36,
                            }}
                        >
                            {message.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </Badge>
                    
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                fontWeight: message.status === 'unread' ? 600 : 400,
                                color: message.status === 'unread' ? 
                                    theme.palette.text.primary : 
                                    theme.palette.text.secondary,
                            }}
                        >
                            {message.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {message.name} • {message.email}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                            {format(new Date(message.createdAt), 'MMM d, yyyy')}
                        </Typography>
                        <Tooltip title={message.status === 'unread' ? 'Mark as read' : 'Mark as unread'}>
                            <IconButton
                                size="small"
                                onClick={() => handleStatusChange(message._id, message.status)}
                                sx={{
                                    color: getStatusColor(message.status),
                                    '&:hover': {
                                        backgroundColor: alpha(getStatusColor(message.status), 0.1),
                                    }
                                }}
                            >
                                {message.status === 'unread' ? <MarkEmailReadIcon /> : <MarkEmailUnreadIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete message">
                            <IconButton
                                size="small"
                                onClick={() => handleDelete(message._id)}
                                sx={{
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Paper>
        </Zoom>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Fade in={true} timeout={800}>
                <Box>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 4 
                    }}>
                        <Typography variant="h4" component="h1" sx={{ 
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <EmailIcon sx={{ fontSize: 32 }} />
                            Message Center
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                size="small"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                }}
                                sx={{
                                    width: 300,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                onClick={() => setFilter(filter === 'all' ? 'unread' : filter === 'unread' ? 'read' : 'all')}
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                {viewMode === 'grid' ? 'List View' : 'Grid View'}
                            </Button>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <Grid container spacing={3}>
                                    {filteredMessages.map((message, index) => (
                                        <Grid item xs={12} md={6} key={message._id}>
                                            {renderMessageCard(message, index)}
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box>
                                    {filteredMessages.map((message, index) => renderMessageList(message, index))}
                                </Box>
                            )}
                            
                            {filteredMessages.length === 0 && (
                                <Box sx={{ 
                                    py: 8, 
                                    textAlign: 'center',
                                    color: 'text.secondary'
                                }}>
                                    <EmailIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                    <Typography variant="h6">
                                        No messages found
                                    </Typography>
                                    <Typography variant="body2">
                                        {searchTerm ? 'Try adjusting your search' : 'Your inbox is empty'}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Fade>

            {/* Message Detail Dialog */}
            <Dialog
                open={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.1)}`,
                    }
                }}
            >
                {selectedMessage && (
                    <>
                        <DialogTitle sx={{ 
                            pb: 1, 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                                {selectedMessage.subject}
                            </Typography>
                            <Box>
                                <Chip 
                                    size="small" 
                                    label={selectedMessage.status === 'unread' ? 'Unread' : 'Read'} 
                                    color={selectedMessage.status === 'unread' ? 'primary' : 'default'}
                                    variant={selectedMessage.status === 'unread' ? 'filled' : 'outlined'}
                                    sx={{ mr: 1 }}
                                />
                                <IconButton 
                                    size="small" 
                                    onClick={() => setSelectedMessage(null)}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{ pt: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: alpha(getStatusColor(selectedMessage.status), 0.1),
                                        color: getStatusColor(selectedMessage.status),
                                        width: 48,
                                        height: 48,
                                        mr: 2
                                    }}
                                >
                                    {selectedMessage.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {selectedMessage.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedMessage.email}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <AccessTimeIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                    {format(new Date(selectedMessage.createdAt), 'MMMM d, yyyy h:mm a')}
                                </Typography>
                            </Box>
                            
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {selectedMessage.message}
                            </Typography>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2 }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => setSelectedMessage(null)}
                                sx={{ borderRadius: '8px' }}
                            >
                                Close
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => {
                                    handleStatusChange(selectedMessage._id, selectedMessage.status);
                                    setSelectedMessage(null);
                                }}
                                sx={{ borderRadius: '8px' }}
                            >
                                {selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Message Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.1)}`,
                    }
                }}
            >
                <MenuItem onClick={() => {
                    const message = messages.find(m => m._id === selectedMessageId);
                    if (message) handleViewMessage(message);
                }}>
                    <ListItemIcon>
                        <MessageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Message</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedMessageId) {
                        const message = messages.find(m => m._id === selectedMessageId);
                        if (message) handleStatusChange(message._id, message.status);
                    }
                    handleMenuClose();
                }}>
                    <ListItemIcon>
                        {messages.find(m => m._id === selectedMessageId)?.status === 'unread' ? 
                            <MarkEmailReadIcon fontSize="small" /> : 
                            <MarkEmailUnreadIcon fontSize="small" />
                        }
                    </ListItemIcon>
                    <ListItemText>
                        {messages.find(m => m._id === selectedMessageId)?.status === 'unread' ? 
                            'Mark as Read' : 
                            'Mark as Unread'
                        }
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    if (selectedMessageId) handleDelete(selectedMessageId);
                    handleMenuClose();
                }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Container>
    );
};

export default Mailbox; 