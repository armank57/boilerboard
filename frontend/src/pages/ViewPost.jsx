import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Chip, Typography, Container, Box, CircularProgress, IconButton, Button, Grid, Tooltip, Menu, MenuItem } from '@mui/material';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getUser } from "../hooks/user.actions";
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';



// const post_options = ['Report', 'Remove'];


function Post() {
    const { id, courseID  } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorElPost, setAnchorElPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const navigate = useNavigate();
    const user = getUser();

    const theme = createTheme({
        palette: {
            primary: {
                main: '#3b3b3b', // Black
            },
            secondary: {
                main: '#ceb888', // Gold
            },
        },
    });


    const fetchPostData = () => {
        axios.get(`http://localhost:8000/api/post/${id}`, {
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
        })
            .then(response => {
                if (response.data) {
                    setPost(response.data);
                    setReplies(response.data.replies);
                    setLoading(false);
                    console.log(response.data);
                } else {
                    navigate(-1);
                }
            })
            .catch(error => {
                setLoading(false);
                if (error.response && error.response.status === 404) {
                    console.error('Post not found:', error);
                    navigate(-1);
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
        } else if (user.is_instructor && !post.endorsed) {
            return ['Endorse', 'Remove']
        } else if (user.is_instructor && post.endorsed) {
            return ['Unendorse', 'Remove']
        }
        return ['Report']
    }

    const post_options = get_post_options();

    const handleReply = () => {
        navigate(`/reply-post/${id}/${courseID}`); // Redirect to reply post page
    };
    
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

    const handleReplyUpvote = async (reply_id) => {
        try {
            const reply = replies.find(reply => reply.id === reply_id);
            if (!reply) {
                console.error('Reply not found:', reply_id);
                return;
            }

            let response;
            if (reply.user_has_upvoted) {
                response = await axios.post(`http://localhost:8000/api/reply/${reply_id}/remove_upvote/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
                if (response.status === 200) {
                    setReplies(prevReplies => prevReplies.map(reply => reply.id === reply_id ? {
                        ...reply,
                        upvotes_count: reply.upvotes_count - 1,
                        user_has_upvoted: false
                    } : reply));
                }
            } else {
                response = await axios.post(`http://localhost:8000/api/reply/${reply_id}/upvote/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });

                if (response.status === 200) {
                    setReplies(prevReplies => prevReplies.map(reply => reply.id === reply_id ? {
                        ...reply,
                        upvotes_count: reply.upvotes_count + 1,
                        user_has_upvoted: true
                    } : reply));
                }
            }
            fetchPostData();
        } catch (error) {
            console.error('Failed to update reply upvote status:', error);
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
                navigate(-1);
            }
        } else if (post_option === "Report") {
            navigate(`/report-content/${id}`)
        } else if (post_option === "Edit") { 
            navigate(`/edit-post/${id}/${courseID}`);
        } else if (post_option === "Endorse") {
            try {
                await axios.post(`http://localhost:8000/api/post/${id}/endorse/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
                fetchPostData();
            } catch (error) {
                console.error('Failed to endorse post:', error);
            }
        } else if (post_option === "Unendorse") {
            try {
                await axios.post(`http://localhost:8000/api/post/${id}/unendorse/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
                fetchPostData();
            } catch (error) {
                console.error('Failed to unendorse post:', error);
            }
        }
        setAnchorElPost(null);
    }

    function replyMapper()  {
        return replies
            .sort((a, b) => new Date(b.created) - new Date(a.created)) // Sort replies by created date
            .map((reply, index) => (
                <Card key={index} style={{ marginBottom: '20px' }}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {reply.title}
                        </Typography>
                        <Typography variant="body2" component="p" style={{ paddingBottom: '16px' }}>
                            {reply.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="textSecondary" style={{ paddingTop: '16px' }}>
                                Created: {new Date(reply.created).toLocaleString()}
                            </Typography>
                            <Typography color="textSecondary" style={{ paddingTop:'16px'}}>
                                Last Updated: {new Date(reply.updated).toLocaleString()}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <div>
                                <IconButton
                                    color="primary"
                                    aria-label="like"
                                    onClick={() => handleReplyUpvote(reply.id)}
                                >
                                    {reply.user_has_upvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                                </IconButton>
                                <Typography variant="body2" component="span">
                                    {reply.ratings}
                                </Typography>
                            </div>
                            <Typography color="textSecondary" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                                {reply.author_name}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ));
    }
    
    
    return (
        <ThemeProvider theme={theme}>
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
                <Typography variant="body2" component="p" style={{ paddingBottom: '16px' }}>
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
                    <Typography color="textSecondary" style={{ paddingTop:'16px'}}>
                        Created: {new Date(post.created).toLocaleString()}
                    </Typography>
                    <Typography color="textSecondary" style={{ paddingTop:'16px'}}>
                        Last Updated: {new Date(post.updated).toLocaleString()}
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <div>
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
                    </div>
                    <Typography color="textSecondary" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                        {post.author_name}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
        <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleReply}
            fullWidth
            style={{ marginBottom: '20px' }}
        >
            Reply
        </Button>
        {replyMapper()}
    </Container>
    </ThemeProvider>
    );
}

export default Post;