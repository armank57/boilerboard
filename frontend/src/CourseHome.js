import { React, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
function CourseHome() {
    const [courses, setCourses] = useState([]);
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
        axios.get('http://localhost:8000/api/course')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    function CourseMapper() {
        return courses.map((course, index) => (
            <Link to={`/courses/${course.name}`} key={index} style={{ textDecoration: 'none' }}>
                <Card style={{ 
                    backgroundColor: theme.palette.primary.main, 
                    marginBottom: '20px',
                    height: '100px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}>
                    <CardContent>
                        <Typography variant="h5">
                            {course.title}
                        </Typography>
                        <Typography variant="body1" style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
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
                <Typography variant="h3" style={{ marginBottom: '20px' }}>
                    Courses
                </Typography>
                <div>
                    {CourseMapper()}
                </div>
                <Link to="/discussions">
                    <Button variant="contained" color="secondary">
                        Discussions
                    </Button>
                </Link>
            </Container>
        </ThemeProvider>
    );
}

export default CourseHome;