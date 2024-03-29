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

export default function ViewProfile() {
    const [user, setUser] = useState(getUser());
    const [posts, setPosts] = useState([]);
    const [courses, setCourses] = useState([]);

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

        axios.get('http://localhost:8000/api/course')
            .then(response => {
                setCourses(response.data.filter(course => course.students.includes(user.id)));
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });

        fetchPosts();
    }, []);

    function CourseMapper() {
        return courses.map((course, index) => (
            <Grid item xs={4} key={index}>
            <Link to={`/courses/${course.id}/`} style={{ textDecoration: 'none' }}>
                <Card style={{ 
                    backgroundColor: '#d3d3d3', 
                    marginBottom: '20px',
                    marginRight: '5px',
                    marginLeft: '5px',
                    height: '100px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}>
                    <CardContent>
                        <Typography variant="h5">
                            {course.course_subject + ' ' + course.code}
                        </Typography>
                        <Typography variant="body1" style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {course.name}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
            </Grid>
        ));
    }

    return (
        <ThemeProvider theme={theme}>
        <Typography variant="h4" sx={{ flexGrow: 1 }} style={{color: "white", paddingLeft: "10px"}}>
                {user.first_name + " " + user.last_name}
        </Typography>
        <Grid container direction="row" sx={{ my: 4 }}>
            <Grid item xs={6}>
            <Box sx={{ marginTop: 5, marginLeft: 5 }}>
                <Grid container direction="column" sx={{ my: 4 }}>
                <Toolbar>
                    <Avatar src={user.avatar} alt="Profile" sx={{ marginRight: 2, width: 60, height: 60 }} />
                    <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{color: "white"}} >
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
                        Total Upvotes: {user ? user.user_rating : "View Profile"}
                        </Typography>
                    </Grid>
                    </CardContent>
                </Card>
                </Grid>
            </Box></Grid>
            <Grid item xs={6}>
            <Box sx={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>
                <Grid container direction="column" sx={{ my: 4 }}>
                <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{color: "white"}}>
                    Posts
                </Typography>
                <Paper>
                    <List>
                    {posts.filter(post => post.is_author).map((post) => (
                        <ListItem key={post.id}>
                        <ListItemText
                            primary={post.title}
                            secondary={post.content}
                        />
                        </ListItem>
                    ))}
                    </List>
                </Paper>
                </Grid>
            </Box>
            </Grid>
            <Grid item xs={6}>
                <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                    <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{color: "white"}}>
                        Courses
                    </Typography>
                </Box>
                <Card sx={{ marginLeft: 5}} 
                    style={{
                    height: '150px',
                    overflow: 'scroll',
                }}>
                    <CardContent>
                        <Grid container direction="row">
                            {CourseMapper()}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        </ThemeProvider>
    );
}