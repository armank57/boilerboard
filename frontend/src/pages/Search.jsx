import { React, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Card, CardContent, Container, MenuItem, Select, Tabs, Tab, TextField, Typography, Grid, Box, Badge, modalClasses } from '@mui/material';
function Search() {
    const navigate = useNavigate();

    const numPosts = 5; // Number of posts to display initially + load more
    const tabs = ['Courses', 'Modules', 'Quizzes', 'Posts'];
    const [joined, setJoined] = useState([]); // State for joined courses, used for filtering discussions
    const [courses, setCourses] = useState([]); // State for courses, used for displaying courses
    const [modules, setModules] = useState([]); // State for modules, used for displaying modules
    const [quizzes, setQuizzes] = useState([]); // State for quizzes, used for displaying quizzes
    const [posts, setPosts] = useState([]); // State for posts, used for displaying posts
    const [loadCount, setLoadCount] = useState(numPosts); // State for load count, used for loading more discussions
    const [currentTopic, setCurrentTopic] = useState('Courses'); // State for current topic, used for filtering discussions
    const [searchTerm, setSearchTerm] = useState(''); // State for search term, used for searching discussions
    const [sortType, setSortType] = useState('date'); // State for sort type, used for sorting discussions

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
        async function fetchData() {
            await axios.get(`http://127.0.0.1:8000/api/user/${JSON.parse(localStorage.getItem('auth')).user.id}`, { //MAKE ASYNC FUCNTIO
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
            })
            .then(response => {
                setJoined(response.data.joined_courses);
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
            }
            );
        await axios.get(`http://127.0.0.1:8000/api/course/`, { //MAKE ASYNC FUCNTIO
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
            })
            .then(response => {
                const c = response.data
                setCourses(response.data);
                const fil = c.filter(course => joined.includes(course.id))
                const mod = fil.flatMap(course => course.sections.flatMap(section => section.modules))
                setModules(mod)
                console.log(mod)
                const quiz = mod.flatMap(module => module.quizzes)
                setQuizzes(quiz)
                const post = fil.flatMap(course => course.posts)
                setPosts(post)
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
            }
            );
        }
        fetchData();
    },[modules]);

    async function HandleSearch(e) {
        if (e.key === 'Enter') {
            
        }

    }

    function tabMapper() {
        return tabs.map((tab, index) => (
            <Tab key={index} label={tab} value={tab} />
        ));
    }

    function loadMore() {
        setLoadCount(loadCount + numPosts);
    }

    function switchTab(event, newValue) {
        setCurrentTopic(newValue);
        setLoadCount(numPosts);
    }

    function infoMapper() {
        if (currentTopic === 'Courses') {
            return courses.filter(course => course.description.toLowerCase().includes(searchTerm.toLowerCase())).map((course, index) => {
                return (
                    <Card key={index} style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {course.description}
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                );
            });
        } else if (currentTopic === 'Modules') {
            return modules.filter(mod => mod.name.toLowerCase().includes(searchTerm.toLowerCase())).map((module, index) => {
                return (
                    <Card key={index} style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <Link to={`/courses/${module.course_id}/${module.section}/${module.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {module.name}
                                </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                );
            });
        } else if (currentTopic === 'Quizzes') {
            return quizzes.filter(quiz => quiz.title.toLowerCase().includes(searchTerm.toLowerCase())).map((quiz, index) => {
                return (
                    <Card key={index} style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <Link to={`/quiz/${quiz.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {quiz.title}
                                </Link>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {quiz.description}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            });
        } else {
            return posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())).map((post, index) => {
                return (
                    <Card key={index} style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <Link to={`/post/${post.id}/${post.course}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {post.title}
                                </Link>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {post.content}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            });
        }
    }

    return (
<div className="discussions">
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <TextField 
                            label="Search" 
                            variant="outlined" 
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
                            onKeyDown={HandleSearch}
                            sx={{ 
                                "& .MuiOutlinedInput-root": {
                                    color: theme.palette.primary.main,
                                    "& fieldset": {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    "&:hover fieldset": {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                        <Select
                            variant="outlined"
                            value={sortType}
                            onChange={event => setSortType(event.target.value)}
                            sx={{ input: { color: "white" } }}
                        >
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                        </Select>
                    </div>
                    <Tabs value={currentTopic}
                        onChange={switchTab}
                        indicatorColor="secondary"
                        
                    >
                        {tabMapper()}
                    </Tabs>
                    <div >
                        {infoMapper()
}
                    </div>
                </Container>
                {//(loadCount <= discussions.filter(discussion => currentTopic === 'All' || discussion.topic === currentTopic).length) ?
                    <Container maxWidth="sm" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px'
                    }}>
                        <Button onClick={loadMore}
                            variant="contained"
                            color="secondary"
                            style={{ margin: '20px' }}
                        >
                            Load More
                        </Button>
                    </Container>
                    //: null
                }
            </ThemeProvider>
        </div>
    );
}

export default Search;