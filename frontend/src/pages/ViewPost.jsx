import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Chip, Typography, Container, Box, CircularProgress, IconButton, Grid, Tooltip, Menu, MenuItem } from '@mui/material';
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

    

    
    
    useEffect(() => {
        axios.get(`http://localhost:8000/api/post/${id}`, {
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
        })
            .then(response => {
                setPost(response.data);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
                setLoading(false);
            }
            );
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
            return ['Remove', 'Report'];
        } else if(user.id === post.author.id) {
            return ['Remove', 'Report']
        } else if (user.instructor) {
            return ['Remove']
        }
        return ['Report']
    }

    const post_options = get_post_options();

    const handleUpvote = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/post/${id}/upvote/`, {}, {
                headers: {
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                }
            });
        } catch (error) {
            console.error('Failed to upvote post:', error);
        }
    }

    const handleOpenPostOptions = (event) => {
        setAnchorElPost(event.currentTarget);
    }

    const handleClosePostOptions = (event) => {
        if (event.currentTarget.innerText === "Remove") {
            try {
                const response =  axios.post(`http://localhost:8000/api/post/${id}/remove_reported_content/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
            } catch (error) {
                console.error('Failed to remove post:', error);
            } 
        } else if(event.currentTarget.innerText === "Report") { // If the user selected
            navigate(`/report-content/${id}`)
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
                                <MenuItem key={post_option} onClick={handleClosePostOptions} >
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
            </CardContent>
        </Card>
    </Container>
    );
}

export default Post;