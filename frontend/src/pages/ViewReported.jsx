import React, { useState, useEffect } from 'react';
import {
    InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Card, CardContent, Grid, List, ListItem, ListItemText, Paper, IconButton, Chip, Badge
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';

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

export default function ViewReported() {
    const [user, setUser] = useState(getUser());
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    function getUser() {
        const auth = JSON.parse(localStorage.getItem("auth")) || null;
        if (auth) {
            return auth.user;
        } else {
            console.log("auth is null");
            return null;
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            if (user.is_instructor === false) {
                alert("You do not have permission to view this page.");
                return;
            }
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
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    async function removePost(postId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/remove_reported_content/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`, // Replace user.token with your actual token
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quiz = await response.json();
            console.log(quiz);
            alert('Successfully deleted content!');
            window.location.reload(); // Add this line
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    }

    async function dismissReport(postId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/dismiss_report/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`, // Replace user.token with your actual token
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quiz = await response.json();
            console.log(quiz);
            alert('Successfully dismissed content!');
            window.location.reload(); // Add this line
        } catch (error) {
            console.error('Error dismissing content:', error);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Typography variant="h4" sx={{ flexGrow: 1 }} style={{ color: "white", paddingLeft: "10px" }}>
                Reported Posts
            </Typography>
            <Grid item xs={6}>
                <Box sx={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>
                    <List>
                        {posts.filter(post => (post.reports > 0)).map((post) => (
                            <ListItem key={post.id}>
                                <Card sx={{ marginBottom: 3, width: "100%" }}>
                                    <CardContent>
                                        <Grid container direction="row">
                                            <Grid item xs={8}>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={11}>
                                                        <Typography variant="h5" component="h2">
                                                            {post.title}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Chip label={post.topic} />
                                                <Typography color="textSecondary">
                                                    Created: {new Date(post.created).toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" component="p" sx={{ marginTop: 1 }}>
                                                    {post.content}
                                                </Typography>
                                                <Grid container sx={{ marginTop: 1 }}>
                                                    <Badge color="primary">
                                                        <ThumbUp />
                                                    </Badge>
                                                    <Typography sx={{ marginLeft: 1 }}>
                                                        {post.ratings}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body5" sx={{ m: 2, marginTop: 4 }}>
                                                    Reasons for report:
                                                </Typography>
                                                {post.badContentList.map((badContent, index) => (
                                                    <Typography key={index} variant="body2" color="error" sx={{ m: 2, marginTop: 0 }}>
                                                        {index + 1}. {badContent.reportedContent}
                                                    </Typography>
                                                ))}
                                                <Grid container direction="row" spacing={2}>
                                                    <Grid item>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => removePost(post.id)} // Pass the index here
                                                            size="small"
                                                        >
                                                            Remove Post
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => dismissReport(post.id)} // Pass the index here
                                                            size="small"
                                                        >
                                                            Dismiss Report
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Grid>
        </ThemeProvider>
    );
}