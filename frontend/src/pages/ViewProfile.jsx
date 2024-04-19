import React, { useState, useEffect } from 'react';
import {
    Toolbar, MenuItem, Typography,
    Box, Card, CardContent, Grid, List,
    Chip, Container, CircularProgress,
    IconButton, Tooltip, Menu, Paper, Badge, Button
} from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'; 
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
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const [authorPosts, setAuthorPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

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
                setAuthorPosts(posts.filter(post => post.is_author));
                console.log(posts);
                setPosts(posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        axios.get('http://localhost:8000/api/course', {
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
        })
            .then(response => {
                setCourses(response.data.filter(course => course.students.includes(user.id)));
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });

        axios.post(`http://127.0.0.1:8000/api/user/${user.id}/get_bookmarked_posts/`, {}, {
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
        })
            .then(response => {
                setBookmarkedPosts(response.data.bookmarked_posts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });

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
    console.log(user);

    const total_upvotes = total_rating;

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

    function PostMapper() {
        const authorPosts = posts.filter(post => post.is_author);

        return authorPosts.length > 0 ? (
            authorPosts
                .sort((a, b) => b.new_reply - a.new_reply)
                .map((post) => (
                    <Link key={post.id} to={`/post/${post.id}/${post.course}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card sx={{ marginBottom: 3 }}>
                            <CardContent>
                                <Grid container justifyContent="space-between">
                                    <Grid item xs={11}>
                                        <Typography variant="h5" component="h2">
                                            {post.title}
                                        </Typography>
                                    </Grid>
                                    {post.new_reply && (
                                        <Grid item xs={0.5}>
                                            <CircleNotificationsIcon color="secondary" />
                                        </Grid>
                                    )}
                                </Grid>
                                <Typography
                                    variant="body2"
                                    component="p"
                                    style={{
                                        paddingBottom: '20px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        minHeight: '4.5em',
                                    }}
                                >
                                    {post.content.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </Typography>
                                <Chip label={post.topic} />
                                <Chip label={post.course_number} />
                                {post.endorsed && <Chip label="Endorsed" color="secondary" />}
                                <Box display="flex" justifyContent="space-between">
                                    <Typography color="textSecondary" style={{ paddingTop: '16px' }}>
                                        Created: {new Date(post.created).toLocaleString()}
                                    </Typography>
                                    <Typography color="textSecondary" style={{ paddingTop: '16px' }}>
                                        Last Updated: {new Date(post.updated).toLocaleString()}
                                    </Typography>
                                </Box>
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
                ))
        ) : (
            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="body1  " component="h5">
                        It looks like you haven't made any posts yet...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    function BookedmarkPostMapper() {
        return bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((post) => (
                <Link key={post.id} to={`/post/${post.id}/${post.course}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card sx={{ marginBottom: 3 }}>
                        <CardContent>
                            <Grid container justifyContent="space-between">
                                <Grid item xs={11}>
                                    <Typography variant="h5" component="h2">
                                        {post.title}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography
                                variant="body2"
                                component="p"
                                style={{
                                    paddingBottom: '20px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    minHeight: '4.5em',
                                }}
                            >                                
                            {post.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                            </Typography>
                            <Chip label={post.topic} />
                            <Chip label={post.course_number} />
                            {post.endorsed && <Chip label="Endorsed" color="secondary" />}
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="textSecondary" style={{ paddingTop: '16px' }}>
                                    Created: {new Date(post.created).toLocaleString()}
                                </Typography>
                                <Typography color="textSecondary" style={{ paddingTop: '16px' }}>
                                    Last Updated: {new Date(post.updated).toLocaleString()}
                                </Typography>
                            </Box>
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
            ))
        ) : (
            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="body1  " component="h5">
                        It looks like you haven't bookmarked any posts yet...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Typography variant="h4" sx={{ flexGrow: 1 }} style={{ color: "white", paddingLeft: "10px" }}>
                {user.first_name + " " + user.last_name}
            </Typography>
            <Grid container direction="row" sx={{ my: 4 }}>
                <Grid item xs={6}>
                    <Box sx={{ marginTop: 5, marginLeft: 5 }}>
                        <Grid container direction="column" sx={{ my: 4 }}>
                            <Toolbar style={{ paddingBottom: "10px" }}>
                                <Avatar src={user.avatar} alt="Profile" sx={{ marginRight: 2, width: 60, height: 60 }} />
                                <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{ color: "white" }} >
                                    {user ? user.username : "View Profile"}
                                </Typography>
                            </Toolbar>
                            <Card sx={{ width: '100%', height: '250px', bgcolor: 'secondary.main' }}>
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
                    </Box>
                </Grid>
                <Grid item xs={5} sx={{ marginLeft: 8, marginTop: 9 }}>
                    <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                        <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{ color: "white" }}>
                            Courses
                        </Typography>
                    </Box>
                    <Card sx={{ marginLeft: 5 }}
                        style={{
                            height: '250px',
                            overflow: 'scroll',
                        }}>
                        <CardContent>
                            <Grid container direction="row">
                                {CourseMapper()}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>
                        <Grid container direction="column" sx={{ my: 4 }}>
                            <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{ color: "white" }}>
                                My Posts
                            </Typography>
                            <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                            <List>
                                {PostMapper()}
                            </List>
                            </Box>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ marginTop: 5, marginLeft: 5, marginRight: 5 }}>
                        <Grid container direction="column" sx={{ my: 4 }}>
                            <Typography variant="h6" component="div" sx={{ marginRight: 2, fontSize: '1.5rem' }} style={{ color: "white" }}>
                                Bookmarked Posts
                            </Typography>
                            <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                            <List>
                                {BookedmarkPostMapper()}
                            </List>
                            </Box>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}