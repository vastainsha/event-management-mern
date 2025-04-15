import React from 'react';
import { Card, CardActionArea, useTheme, alpha, Box } from '@mui/material';

const AnimatedCard = ({
    children,
    onClick,
    elevation = 1,
    borderRadius = 3,
    hoverElevation = 8,
    hoverTransform = 'translateY(-8px)',
    gradientOpacity = 0.1,
    gradientOpacityHover = 0.05,
    sx = {},
    ...props
}) => {
    const theme = useTheme();

    return (
        <Card
            elevation={elevation}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                    transform: hoverTransform,
                    boxShadow: theme.shadows[hoverElevation],
                    '&::before': {
                        opacity: 1,
                    },
                    '& .MuiCardMedia-root': {
                        transform: 'scale(1.05)',
                    },
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, gradientOpacity)}, ${alpha(theme.palette.primary.main, gradientOpacityHover)})`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 1,
                },
                ...sx,
            }}
            {...props}
        >
            {onClick ? (
                <CardActionArea
                    onClick={onClick}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    {children}
                </CardActionArea>
            ) : (
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                    {children}
                </Box>
            )}
        </Card>
    );
};

export default AnimatedCard; 