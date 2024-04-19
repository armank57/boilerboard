import React, { useState, useEffect } from 'react';
import {
    InputLabel, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Grid, InputAdornment, Paper
} from '@mui/material';

import { Link, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CardMedia } from '@material-ui/core';


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
    MuiTextField: {
        styleOverrides: {
            root: {
                border: '1px solid white'
            },
        },
    },
});

const fieldStyling = {
    input: { color: 'white' },
    fieldset: { borderColor: "white" },
    "& .MuiOutlinedInput-root:hover": {
        "& fieldset": {
            borderColor: "pink"
        },
        "&.Mui-focused fieldset": {
            borderColor: "pink",
        },

    }
}

function CreateNote() {
    const location = useLocation();
    const { cid, sid, mid } = location.state;
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const maxSize = 1024 * 1024; // 1MB

        if (file.size > maxSize) {
            alert('File is too large. Please upload a file smaller than 1MB.');
            return;
        }
        setImage(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]));

    };

    const backToStudyPage = () => {
        navigate(-1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!text && !image) {
            alert('Please upload an image or insert text.');
            return;
        }

        const formData = new FormData();
        formData.append('content', text);
        if (image) {
            formData.append('image', image);
        }
        formData.append('module', mid);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/note/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`,
                },
            });

            console.log(response.data);

            alert('Note created successfully!');

            navigate(-1);
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <TextField
                    variant="outlined"
                    placeholder="Enter text"
                    multiline
                    rows={10}
                    sx={{ width: '75%', backgroundColor: '#fff' }}
                    value={text}
                    onChange={handleTextChange}
                />
                <Box display="flex" alignItems="center" flexDirection={"column"}>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                    {imageUrl && <img
                        src={imageUrl}
                        alt="Note"
                        style={{
                            width: '60%',
                            height: 'auto',
                            objectFit: 'contain',
                            cursor: 'pointer'
                        }}
                    />}
                </Box>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
                <Button sx={{ marginTop: 3 }} variant="contained" color="primary" onClick={backToStudyPage}>
                    Back to Study Page
                </Button>
            </Box>
        </ThemeProvider>
    );
}

export default CreateNote;