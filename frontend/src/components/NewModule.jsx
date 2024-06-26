// import './NewModule.css';
import { React, useState, useEffect } from 'react';
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
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/course/${courseID}/is_in_course/`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`
            }
        })
        .then(response => {
            //alert(response.data)
            if(!response.data){
                navigate(`/courses/${courseID}`)
            }
        })
        .catch(error => {
            console.error('Error fetching is_in_course:', error);
        });
    }, [courseID]);

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
                course: courseID,
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
            } else if (response.status === 500) {
                alert("Module with that name already exists in this section")
            } else {
                // Module not created
                console.error('Module not created:', response);
            }
        } catch (error) {
            console.error('Error creating module:', error);
            alert("Error:" + error)
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