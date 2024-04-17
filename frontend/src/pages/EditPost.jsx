import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Container, Select, MenuItem, FormControl, InputLabel, Typography, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function EditPost() {
    const navigate = useNavigate();
    const { id, courseID } = useParams();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('General'); // Default topic is General
    const [content, setContent] = useState('');

    // Static list of topics to tab-by
    const topics = ['General', 'Homework', 'Exams', 'Projects', 'Labs', 'Quizzes', 'Other'];

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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/post/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });

                if (response.status === 200) {
                    setTitle(response.data.title);
                    setTopic(response.data.topic);
                    setContent(response.data.content);
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/post/${id}/`, {
                title: title,
                topic: topic,
                content: content,
                course: `${courseID}`,
                author: `${(JSON.parse(localStorage.getItem('auth'))).user.id}`
            },
            {
                headers: {
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                }
            });

            if (response.status === 200) {
                alert('Post updated!');
                navigate(-1);
            } else {
                alert('Failed to update post');
            }
        } catch (error) {
            console.error('Failed to update post:', error);
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

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Typography variant="h3" style={{ paddingBottom: '20px', color: "white" }}>
                    Edit Post
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <FormControl fullWidth required variant="outlined" style={{ marginBottom: '20px' }}>
                        <InputLabel id="topic-label" style={{ color: 'white' }}>Topic</InputLabel>
                        <Select
                            labelId="topic-label"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            label="Topic"
                            inputProps={{style: {borderColor: "white"}}}
                            sx={{
                                ...fieldStyling,
                                select: {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiSelect-icon': {
                                    color: 'white',
                                },
                            }}
                        >
                            {topics.map((topic) => (
                                <MenuItem key={topic} value={topic}>
                                    {topic}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Title"
                        variant="outlined"
                        sx={fieldStyling}
                        InputLabelProps={{
                            style: { 
                                color: 'white',
                            },
                        }}
                        fullWidth
                        required
                        style={{ marginBottom: '20px'}}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
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
                            <Button variant="contained" color="secondary" type="submit" fullWidth>
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

export default EditPost;