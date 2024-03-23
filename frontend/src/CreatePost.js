import React, { useState } from 'react';
import { Box, Button, TextField, Container, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';


// TODO: Connect this to be within a course!
// TODO: Make this function return back to the Discussions page upon Submission or Cancel
// TODO: Add a cancel button
function CreatePost() {
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
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/post/', {
                title: title,
                topic: topic,
                content: content,
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
            } else {
                alert('Failed to submit post');
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Typography variant="h3" style={{ paddingBottom: '20px' }}>
                    Create Post
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <FormControl fullWidth required variant="outlined" style={{ marginBottom: '20px' }}>
                        <InputLabel id="topic-label">Topic</InputLabel>
                        <Select
                            labelId="topic-label"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            label="Topic"
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
                        fullWidth
                        required
                        style={{ marginBottom: '20px' }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Content"
                        variant="outlined"
                        fullWidth
                        required
                        multiline
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '20px' }}>
                        Submit
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default CreatePost;