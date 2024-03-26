import React, { useState, useEffect } from 'react';
import {
    InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Card, CardContent, Grid, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    const [post, setPost] = useState([]);
    const [reason, setReason] = useState('');
    const { postId } = useParams();

    const reportContent = async () => {

        const data = {
            "reportedContent": reason,
        };
    
        // Send the POST request
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/report_content/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`, // Replace user.token with your actual token
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quiz = await response.json();
            console.log(quiz);
            alert('Successfully reported content!');
        } catch (error) {
            console.error('Error reporting content:', error);
            alert('Error reporting content, you may have already reported this post.');
        }
    };


    useEffect(() => {
        const fetchPost = async (publicId) => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/post/${publicId}`, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`, // Replace user.token with your actual token
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const post = await response.json();
                console.log(post);
                setPost(post);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPost(postId); // Replace with the publicId of the post you want to fetch
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
            <Paper sx={{ flexGrow: 1, p: 3, marginLeft: 'auto', marginRight: 'auto', marginTop: 2, maxWidth: '50%' }}>
                <Typography variant="h5" component="div">
                    {post.title}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2, marginBottom: 2 }} component="div">
                    {post.content}
                </Typography>
                <Typography variant="body1" component="div">
                    Upvotes: {post.ratings}
                </Typography>
                <Typography variant="body1" component="div">
                    Author: {post.author_name}
                </Typography><TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="reason"
                    label="Reason for reporting"
                    name="reason"
                    autoComplete="reason"
                    autoFocus
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={reportContent}
                >
                    Report Content
                </Button>
            </Paper>
        </ThemeProvider>
    );
}