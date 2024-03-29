import React, { useState, useEffect } from 'react';
import {
    Toolbar, MenuItem, Typography,
    Box, Card, CardContent, Grid, List,
    Chip, Container, CircularProgress,
    IconButton, Tooltip, Menu, Paper, Badge, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getUser } from "../hooks/user.actions";
import { useNavigate } from 'react-router-dom';


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

export default function ViewProfile() {
    const [user, setUser] = useState(getUser());
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

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
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    function viewReportedContent() {
        navigate('/view-reported')
    }

    var total_rating = 0;
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].author_name === user.username) {
            total_rating += posts[i].ratings;
        }
    }

    const total_upvotes = total_rating;

    return (
        <ThemeProvider theme={theme}>
            <Typography variant="h4" sx={{ flexGrow: 1 }} style={{ color: "white", paddingLeft: "10px" }}>
                {user.first_name + " " + user.last_name}
            </Typography>
            <Grid container direction="row" sx={{ my: 4 }}>
                <Grid item xs={4}>
                    <Box sx={{ marginTop: 5, marginLeft: 5 }}>
                        <Grid container direction="column" sx={{ my: 4 }}>
                            <Toolbar style={{ paddingBottom: "10px" }}>
                                <Avatar src={user.avatar} alt="Profile" sx={{ marginRight: 2, width: 60, height: 60 }} />
                                <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{ color: "white" }} >
                                    {user ? user.username : "View Profile"}
                                </Typography>
                            </Toolbar>
                            <Card sx={{ width: '100%' }}>
                                <CardContent>
                                    <Grid container direction="column" sx={{ my: 2 }}>
                                        <Typography variant="h6" component="div" sx={{ marginRight: 2 }} >
                                            First Name: {user ? user.first_name : "View Profile"}
                                        </Typography>
                                        <Typography variant="h6" component="div" sx={{ marginRight: 2 }} >
                                            Last Name: {user ? user.last_name : "View Profile"}
                                        </Typography>
                                        <Typography variant="h6" component="div" sx={{ marginRight: 2 }} >
                                            Email: {user ? user.email : "View Profile"}
                                        </Typography>
                                        <Typography variant="h6" component="div" sx={{ marginRight: 2 }} >
                                            Rating: {total_upvotes}
                                        </Typography>
                                        {user.is_instructor ? (
                                            <Button size="small" sx={{ marginTop: 2, width: "60%" }} variant="contained" color="primary" onClick={viewReportedContent}>
                                                View Reported Content
                                            </Button>
                                        ) : null}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Box></Grid>
                <Grid item xs={8}>
                    <Box sx={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>
                        <Grid container direction="column" sx={{ my: 4 }}>
                            <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{ color: "white" }}>
                                Posts
                            </Typography>
                            <List>
                                {posts.filter(post => post.is_author).map((post) => (
                                    <Link key={post.id} to={`/post/${post.id}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Card sx={{ marginBottom: 3 }}>
                                            <CardContent>
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
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </List>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}