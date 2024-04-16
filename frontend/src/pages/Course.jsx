
import React, { useState, useEffect } from 'react'
import {
    InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Card, CardContent, Grid, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate, Link } from "react-router-dom"
import CourseButton from '../components/JoinCourseButton'
import useSWR from 'swr'
import axios from 'axios'
const fetcher = url => axios.get(url, {
    headers: {
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
    }
}).then(res => res.data)
function Course() {

    const navigate = useNavigate()
    const { courseID } = useParams()
    const { data, error } = useSWR(`http://127.0.0.1:8000/api/course/${courseID}`, fetcher)
    const [isInCourse, setIsInCourse] = useState(false);
    const [isSuper, setIsSuper] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/course/${courseID}/is_in_course/`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`
            }
        })
        .then(response => {
            setIsInCourse(response.data);
        })
        .catch(error => {
            console.error('Error fetching is_in_course:', error);
        });
        axios.get(`http://127.0.0.1:8000/api/course/${courseID}/is_super/`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`
            }
        })
        .then(response => {
            setIsSuper(response.data);
        })
        .catch(error => {
            console.error('Error fetching is_super:', error);
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

    const newSectionHandler = () => {
        console.log('New Section');
        const secName = prompt('Please enter the name of the new section')

        console.log('Course ID:', courseID)
        console.log('Section Name:', secName);

        try {
            const response = axios.post('http://127.0.0.1:8000/api/section/', {
                name: secName,
                course: courseID,
            }, {
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500                
                }
            });

            if (response.status === 201) {
                console.log(`Section created: ${response.data}`);
            } else if (response.status === 400) { 
                console.error(`Section not created: ${response.data.detail}`);
            }
        } catch (error) {
            // Network error or any other error with status code 500 or above
            alert('Error:', error);
            console.log(error);
        }

        //alert(`You entered: ${secName}`)
    }

    const newModuleHandler = (sectionID) => {
        console.log('New Module');
        navigate(`/courses/${courseID}/${sectionID}/new-module`);
    }

    function ModuleMapper(i, section) {
        const sortedModules = section.modules.sort((a, b) => a.subsection - b.subsection);
        return sortedModules.map((module, index) => (
            isInCourse ? <Link to={`/courses/${courseID}/${section.id}/${module.id}/`}>
                <Card key={index} style={{ 
                    backgroundColor: '#d3d3d3', 
                    marginBottom: '20px',
                    height: '100px',
                    overflow: 'scroll',
                    marginRight: '10px',
                }}>
                    <CardContent>
                        <Typography variant="h5">
                            {(i+1) + "." + module.subsection}
                        </Typography>
                        <Typography>
                            {module.name}
                        </Typography>
                        
                    </CardContent>
                </Card>
            </Link> :
            <Card key={index} style={{ 
                backgroundColor: '#d3d3d3', 
                marginBottom: '20px',
                height: '100px',
                overflow: 'scroll',
                marginRight: '10px',
            }}>
                <CardContent>
                    <Typography variant="h5">
                        {(i+1) + "." + module.subsection}
                    </Typography>
                    <Typography>
                        {module.name}
                    </Typography>
                    
                </CardContent>
            </Card>
        ));
    }

    function SectionMapper() {
        return data.sections.map((section, index) => (
            //<Grid container direction="row">
                <Card key={index} style={{
                    backgroundColor: '#d3d3d3', 
                    marginBottom: '20px',
                    height: '200px',
                    overflow: 'scroll',
                }}>
                    <CardContent>
                        <Grid container direction="row">
                            <Grid item xs={8}>
                                <Typography variant="h5">
                                    {section.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Box display="flex" justifyContent="flex-end">
                                    {isSuper?<Button
                                        name="createModule"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => newModuleHandler(section.id)}
                                    >
                                        New Module
                                    </Button>:<></>}
                                </Box>
                            </Grid>
                            <Grid item xs={12} style={{ overflowX: 'auto', display: 'flex' }}>
                                {ModuleMapper(index, section)}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            //</Grid>
        ));
    }

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Grid container direction="row">
                    <Grid item xs={12}>
                        <h3 style={{color: "white"}}>{data.description}</h3>
                    </Grid>
                    <Grid item xs={1}>
                        <CourseButton cid={data.id} inCourse={isInCourse} setCourse={setIsInCourse}/>
                    </Grid>
                    <Grid item xs={2}>
                        {
                        isSuper?
                        <Button
                            name="addSection"
                            variant="contained"
                            color="secondary"
                            onClick={newSectionHandler}
                        >
                            New Section
                        </Button>:
                        <></>
                        }
                    </Grid>
                    <Grid item xs={9}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                        <Button
                            name="discussions"
                            variant="contained"
                            color="secondary"
                        >
                            {isInCourse ?
                            <Link to={`/courses/${courseID}/discussions`} style={{ textDecoration: 'none', color: 'unset' }}>
                                Discussions
                            </Link> :
                            "Discussions"
                            }
                        </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {SectionMapper()}
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    )
}

export default Course;
