// import './NewModule.css';
import { React, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme, ThemeProvider } from '@mui/material/styles';
function NewModule() {
    const navigate = useNavigate();

    const { courseID, sectionID } = useParams();
    const [name, setName] = useState('');
    const [subsection, setSubsection] = useState('');
    //USEEFFECT HERE COURSE ID

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

    const newmod = async (e) => {
        e.preventDefault();
        console.log('Module Name:', name);
        console.log('Subsection:', subsection);
        console.log('Course ID:', courseID);

        try {
            const response = await axios.post('http://localhost:8000/api/module/', {
                name: name,
                section: sectionID,
                subsection: subsection,
                course_id: courseID,
            }, {
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500                
                }
            });

            if (response.status === 201) {
                // Module created
                console.log('Module created:', response.data);
                navigate('/courses');
            } else {
                // Module not created
                console.error('Module not created:', response);
            }
        } catch (error) {
            console.error('Error creating module:', error);
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <Box component="form" onSubmit={newmod}>
                <TextField 
                    label="Name" 
                    type="name"
                    value={name}
                    sx={{ input: { color: 'white' } }}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Module Name"
                    variant="outlined"
                    margin="normal"
                    required
                />
                <TextField 
                    label="Subsection" 
                    type="subsection"
                    value={subsection}
                    sx={{ input: { color: 'white' } }}
                    onChange={(e) => setSubsection(e.target.value)}
                    placeholder="Subsection"
                    variant="outlined"
                    margin="normal"
                    required
                />
                <Button
                    name="createAccount"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                >
                    Create Module
                </Button>
            </Box>
        </ThemeProvider>
    )
}

export default NewModule;