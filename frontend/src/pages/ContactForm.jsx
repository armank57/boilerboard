import React, { useState } from 'react';
import { Box, Button, TextField, Container, Select, MenuItem, FormControl, InputLabel, Typography, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ContactForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [type, setType] = useState('Report Bug'); // Default type is Bug
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // Static list of types
    const types = ['Report Bug', 'Report User', 'Suggest Improvement', 'Miscellaneous'];

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
        // Handle form submission here

        try {
            const response = await axios.post('https://formspree.io/f/xgegpllr', {
                Name: name,
                _replyto: email,
                _type: type,
                Subject: subject,
                Message: message
            });
        } catch (error) {
            console.error('Failed to submit form:', error);
        }

        alert('Form submitted successfully!');
        setName('');
        setEmail('');
        setType('Bug');
        setSubject('');
        setMessage('');
        navigate(-1);
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
                    Contact Form
                </Typography>
                <Typography variant="body1" style={{ paddingBottom: '20px', color: "white" }}>
                    Use this form to report any bugs you come across or any users that are misbehaving.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Email"
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormControl fullWidth required variant="outlined" style={{ marginBottom: '20px' }}>
                        <InputLabel id="type-label" style={{ color: 'white' }}>Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            label="Type"
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
                            {types.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Subject"
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
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <TextField
                        label="Message"
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
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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

export default ContactForm;