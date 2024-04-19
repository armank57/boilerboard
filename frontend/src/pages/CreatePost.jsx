import React, { useState } from 'react';
import { Box, Button, TextField, Container, Select, MenuItem, FormControl, InputLabel, Typography, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { ClassNames } from '@emotion/react';
import { getUser, useUserActions } from "../hooks/user.actions";



// TODO: Connect this to be within a course!
// TODO: Make this function return back to the Discussions page upon Submission or Cancel
// TODO: Add a cancel button

function CreatePost() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cid } = location.state;
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('General'); // Default topic is General
    const [content, setContent] = useState('');
    const user = getUser();
    const userActions = useUserActions();

    // Static list of topics to tab-by
    var topics = [];
    if(user.is_instructor) {
        topics = ['General', 'Announcements', 'Homework', 'Exams', 'Projects', 'Labs', 'Quizzes'];
    } else {
        topics = ['General','Homework', 'Exams', 'Projects', 'Labs', 'Quizzes'];
    }

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
            const response = await axios.post('http://127.0.0.1:8000/api/post/', {
                title: title,
                topic: topic,
                content: content,
                course: `${cid}`,
                author: `${(JSON.parse(localStorage.getItem('auth'))).user.id}`
            },
            {
                headers: {
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                }
            });

            if (response.status === 201) {
                // Clear the form
                alert('Post submitted!');
                setTitle('');
                setTopic('General');
                setContent('');
                navigate(`/courses/${cid}/discussions`);
            } else {
                alert('Failed to submit post');
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
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
                    Create Post
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

export default CreatePost;