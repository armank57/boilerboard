import React, { useState, useEffect } from 'react';
import {
    InputLabel, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Grid, InputAdornment, Paper
} from '@mui/material';

import { Link, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

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


    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]));

    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('content', text);
        formData.append('image', image);
        formData.append('module', mid);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/note/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`,
                },
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
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
                <Box display="flex" alignItems="center">
                    <Button variant="contained" component="label">
                        Upload Image
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>
                    {imageUrl && <img src={imageUrl} alt="Selected" />}
                </Box>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </ThemeProvider>
    );
}

export default CreateNote;