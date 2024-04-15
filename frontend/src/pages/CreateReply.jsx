import React, { useState } from 'react';
import { Box, Button, TextField, Container, Typography, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function CreateReply() {
    const navigate = useNavigate();
    const { id, courseID } = useParams();
    const [content, setContent] = useState('');

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
                author: `${(JSON.parse(localStorage.getItem('auth'))).user.id}`
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

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Typography variant="h3" style={{ paddingBottom: '20px', color: "white" }}>
                    Create Reply
                </Typography>
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

export default CreateReply;