import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MessageContext = createContext();

export const useMessages = () => {
    return useContext(MessageContext);
};

export const MessageProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setUnreadCount(0);
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/api/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const unreadMessages = response.data.filter(msg => msg.status === 'unread');
            setUnreadCount(unreadMessages.length);
        } catch (error) {
            console.error('Error fetching unread messages:', error);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        // Set up polling every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const value = {
        unreadCount,
        loading,
        refreshUnreadCount: fetchUnreadCount
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
}; 