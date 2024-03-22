import React, { useState, useEffect } from 'react';
import {
    InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Card, CardContent, Grid, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3b3b3b', // Black
        },
        secondary: {
            main: '#CEB888', // Gold
        },
    },
    typography: {
        fontFamily: 'Quicksand, sans-serif',
        fontWeightBold: 700,
    },
});

function getUser() {
    const auth = JSON.parse(localStorage.getItem("auth")) || null;
    if (auth) {
        return auth.user;
    } else {
        console.log("auth is null");
        return null;
    }
}

export default function ReportContent() {
    const [user, setUser] = useState(getUser());
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/post/', {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`, // Replace user.token with your actual token
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const posts = await response.json();
                console.log(posts);
                setPosts(posts);
                posts.map((post) => {
                    post.badContentList.map((badContent) => {
                      console.log(badContent.reportedContent);
                    });
                  });
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h4" sx={{ flexGrow: 1 }}>
                        ReportContent
                    </Typography>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}