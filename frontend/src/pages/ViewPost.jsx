import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Chip, Typography, Container, Box, CircularProgress, IconButton, Button, Grid, Tooltip, Menu, MenuItem } from '@mui/material';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getUser } from "../hooks/user.actions";
import { useNavigate } from 'react-router-dom';


// const post_options = ['Report', 'Remove'];


function Post() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorElPost, setAnchorElPost] = useState(null);
    const navigate = useNavigate();
    const user = getUser();

    const fetchPostData = () => {
        axios.get(`http://localhost:8000/api/post/${id}`, {
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
        })
            .then(response => {
                if (response.data) {
                    setPost(response.data);
                    setLoading(false);
                    console.log(response.data);
                } else {
                    navigate('/discussions');
                }
            })
            .catch(error => {
                setLoading(false);
                if (error.response && error.response.status === 404) {
                    console.error('Post not found:', error);
                    navigate('/discussions');
                } else {
                    console.error('Error fetching post:', error);
                }
            });
    };

    useEffect(() => {
        fetchPostData();
    }, [id]);

    if (loading && !post) { 
        return (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    };

    function get_post_options() {
        if(user.username === post.author_name && user.is_instructor) {
            return ['Edit', 'Remove', 'Report'];
        } else if(user.username === post.author_name) {
            // user is the author of the post
            return ['Edit', 'Remove', 'Report']
        } else if (user.instructor) {
            return ['Remove']
        }
        return ['Report']
    }

    const post_options = get_post_options();

    const handleUpvote = async () => {
        try {
            if (post.user_has_upvoted) {
                const response = await axios.post(`http://localhost:8000/api/post/${id}/remove_upvote/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
    
                if (response.status === 200) {
                    setPost(prevPost => ({
                        ...prevPost,
                        upvotes_count: prevPost.upvotes_count - 1,
                        user_has_upvoted: false
                    }));
                }
            } else {
                const response = await axios.post(`http://localhost:8000/api/post/${id}/upvote/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
    
                if (response.status === 200) {
                    setPost(prevPost => ({
                        ...prevPost,
                        upvotes_count: prevPost.upvotes_count + 1,
                        user_has_upvoted: true
                    }));
                }
            }
            fetchPostData();
        } catch (error) {
            console.error('Failed to update upvote status:', error);
        }
    }

    const handleOpenPostOptions = (event) => {
        setAnchorElPost(event.currentTarget);
    }

    const handleClosePostOptions = async (post_option) => {
        if (post_option === "Remove") {
            if (window.confirm('Are you sure you want to remove this post?')) {
                try {
                    await axios.delete(`http://localhost:8000/api/post/${id}/`, {
                        headers: {
                            'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                        }
                    });
                } catch (error) {
                    console.error('Failed to remove post:', error);
                }
                navigate('/discussions');
            }
        } else if (post_option === "Report") {
            navigate(`/report-content/${id}`)
        } else if (post_option === "Edit") { 
            navigate(`/edit-post/${id}`);
        }
        setAnchorElPost(null);
    }
    
    
    // TODO: Add a chip that shows the course number next to the topic
    return (
        <Container maxWidth="md" style={{ marginTop: '5em' }}>
        <Card>
            <CardContent>
                <Grid container justifyContent="space-between">
                    <Grid item xs={11}>
                        <Typography variant="h5" component="h2">
                            {post.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={0.5}>
                        <Tooltip title="Open Options">
                            <IconButton onClick={handleOpenPostOptions} >
                                <MoreHorizIcon></MoreHorizIcon>
                            </IconButton>
                        </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElPost}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={Boolean(anchorElPost)}
                                onClose={handleClosePostOptions}
                            >
                                {post_options.map((post_option) => (
                                    <MenuItem key={post_option} onClick={() => handleClosePostOptions(post_option)} >
                                        <Typography textAlign="center">{post_option}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                    </Grid>
                </Grid>
                <Chip label={post.topic} />
                <Typography color="textSecondary">
                    Author: {post.author_name}
                </Typography>
                <Typography color="textSecondary">
                    Created: {new Date(post.created).toLocaleString()}
                </Typography>
                <Typography color="textSecondary">
                    Last Updated: {new Date(post.updated).toLocaleString()}
                </Typography>
                <Typography variant="body2" component="p">
                    {post.content}
                </Typography>
                <IconButton 
                    color="primary" 
                    aria-label="like"
                    onClick={handleUpvote}
                >
                    {post.user_has_upvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                </IconButton>
                <Typography variant="body2" component="span">
                    {post.ratings}
                </Typography>
            </CardContent>
        </Card>
    </Container>
    );
}

export default Post;