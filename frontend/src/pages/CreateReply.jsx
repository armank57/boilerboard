import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Container, Typography, Grid, Card, CardContent, Chip, Badge, CircularProgress } from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getUser, useUserActions } from "../hooks/user.actions";

function CreateReply() {
    const navigate = useNavigate();
    const { id, courseID } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState({});
    const user = getUser();
    const userActions = useUserActions();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/post/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
                console.log(response.data);
                if (response.status === 200) {
                    setPost(response.data);
                    setLoading(false);
                } else {
                    alert('Failed to fetch post');
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };
        fetchPost();
    }, []);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#d3d3d3', // Black
            },
            secondary: {
                main: '#ceb888', // Gold
            },
        },
        typography: {
            fontFamily: 'Quicksand, sans-serif',
            fontWeightBold: 700,
        },
        MuiTextField: {
            styleOverrides: {
                root: { 
                    border: '1px solid white'
                },
            },
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/reply/', {
                content: content,
                post: `${id}`,
                author: `${(JSON.parse(localStorage.getItem('auth'))).user.id}`,
                instructor_reply: user.is_instructor
                
            },
            {
                headers: {
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                }
            });

            if (response.status === 201) {
                // Clear the form
                alert('Reply submitted!');
                setContent('');
                navigate(`/post/${id}/${courseID}`);
            } else {
                alert('Failed to submit reply');
            }
        } catch (error) {
            console.error('Failed to submit reply:', error);
        }
    };

    const fieldStyling = {
        input: { color: 'white'}, 
        fieldset: { borderColor: "white"},
        "& .MuiOutlinedInput-root:hover": {
            "& fieldset": {
                borderColor: "pink"
            },
            "&.Mui-focused fieldset": {
                borderColor: "pink",
            }
        }
    }

    if (loading) { 
        return (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Typography variant="h3" style={{ paddingBottom: '20px', color: "white" }}>
                    Respond to:
                </Typography>
                <Card sx={{ marginBottom: 3 }}>
                    <CardContent>
                        <Grid container justifyContent="space-between">
                            <Grid item xs={11}>
                                <Typography variant="h5" component="h2">
                                    {post.title}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="body2" component="p" style={{ paddingBottom: '16px' }}>
                            {post && post.content.split('\n').map((line, index) => (
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
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Content"
                        variant="outlined"
                        sx={ fieldStyling }
                        textareaStyle={{color: "white"}}
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        inputProps={{style: {color: "white"}}}
                        fullWidth
                        required
                        multiline
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Grid container spacing={2} style={{paddingTop: "25px"}}>
                        <Grid item xs={6}>
                            <Button variant="contained" color="secondary" type="submit" fullWidth style={{ marginBottom: '20px' }}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color="secondary" fullWidth onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CreateReply;