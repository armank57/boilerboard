import { React, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Course from './Course';
function CourseHome() {
    const [subejcts, setSubjects] = useState([]);
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

    useEffect(() => {
        axios.get('http://localhost:8000/api/subject', {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('auth')).access
            }
        })
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
            });
    }, []);

    function SubjectMapper() {
        return subejcts.map((subject, index) => (
            <Grid item key={index} xs={6}>
                <Typography variant="h4" style={{ marginLeft: '10px', color: "white" }}>
                    {subject.name}
                </Typography>
                <Card style={{ 
                    backgroundColor: theme.palette.primary.main, 
                    marginBottom: '20px',
                    height: '200px',
                    overflow: 'scroll',
                }}>
                    <CardContent>
                        {CourseMapper(subject.code, subject.courses)}
                    </CardContent>
                </Card>
            </Grid>  
        ));
    }

    function CourseMapper(code, courses) {
        return courses.map((course, index) => (
            <Link to={`/courses/${course.id}/`} key={index} style={{ textDecoration: 'none' }}>
                <Card style={{ 
                    backgroundColor: '#d3d3d3', 
                    marginBottom: '20px',
                    height: '100px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}>
                    <CardContent>
                        <Typography variant="h5">
                            {code + ' ' + course.code}
                        </Typography>
                        <Typography>
                            {course.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        ));
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Typography variant="h3" style={{ marginBottom: '20px', color: "white" }}>
                    Courses
                </Typography>
                <Grid container spacing={2}>
                    {SubjectMapper()}
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default CourseHome;