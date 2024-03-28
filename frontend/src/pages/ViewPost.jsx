import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Chip, Typography, Container, Box, CircularProgress, IconButton } from '@mui/material';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';

function Post() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPostData = () => {
        axios.get(`http://localhost:8000/api/post/${id}`, {
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
        })
            .then(response => {
                setPost(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
                setLoading(false);
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
    
    // TODO: Add a chip that shows the course number next to the topic
    return (
        <Container maxWidth="md" style={{ marginTop: '5em' }}>
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {post.title}
                </Typography>
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