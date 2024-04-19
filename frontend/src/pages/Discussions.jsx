import { React, useState, useEffect } from 'react';
import { Button, Card, CardContent, Container, MenuItem, Select, Tabs, Tab, TextField, Typography, Grid, Box, Badge } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

// TODO: Configure back end properly
// TODO: Display only top 10 posts based on recency
// TODO: Make the posts clickable to view the full post

function Discussions() {
    const navigate = useNavigate();

    const numPosts = 5; // Number of posts to display initially + load more
    const {courseID} = useParams();
    const [courseName, setCourseName] = useState([]); // State for course object which consists of course information
    const [discussions, setDiscussions] = useState([]); // State for discussions array which consists of posts that are fetched from database
    const [discLength, setDiscLength] = useState(numPosts); // State for discussions length
    const [loadCount, setLoadCount] = useState(numPosts); // State for load count, used for loading more discussions
    const [currentTopic, setCurrentTopic] = useState('All'); // State for current topic, used for filtering discussions
    const [searchTerm, setSearchTerm] = useState(''); // State for search term, used for searching discussions
    const [sortType, setSortType] = useState('date'); // State for sort type, used for sorting discussions
    // Static list of topics to tab-by
    const topics = ['General','Announcements', 'Homework', 'Exams', 'Projects', 'Labs', 'Quizzes'];

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

    // TODO: add 'discussions' to dependency array
    useEffect(() => {
        // TODO: Link discussions to each course they are a part of
        async function getttt() {
        await axios.get(`http://127.0.0.1:8000/api/course/${courseID}`, { //MAKE ASYNC FUCNTIO
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
            })
            .then(response => {
                setCourseName(response.data.name);
                setDiscussions(response.data.posts);
                console.log(discussions)
                setDiscLength(discussions.length);
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
            }
            );

        }
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
        getttt();
    }, []);

    function discussionMapper() {
        return discussions
            .filter(discussion => currentTopic === 'All' || discussion.topic === currentTopic) // Filter discussions based on currentTopic
            .filter(discussion =>
                discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
            ) // Filter discussions based on search term
            .sort((a, b) => {
                switch (sortType) {
                    case 'date':
                        return new Date(b.updated) - new Date(a.updated); // Sort by date
                    case 'rating':
                        return b.ratings - a.ratings; // Sort by rating
                    default:
                        return 0;
                }
            })
            .slice(0, loadCount)
            .map((discussion, index) => (
                <Link to={`/post/${discussion.id}/${courseID}`} target="_blank" key={index} style={{ textDecoration: 'none', color: 'inherit'}}>
                    <Card style={{
                        backgroundColor: theme.palette.primary.main,
                        marginBottom: '20px',
                        height: '100px',
                        overflow: 'hidden'
                    }}>
                        
                        <CardContent>
                            <Grid container justifyContent="space-between">
                                <Grid item xs={11}>
                                    <Typography variant="h5">
                                        {discussion.title}
                                    </Typography>
                                    <Typography variant="body1" style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {discussion.content}
                                    </Typography>
                                </Grid>
                                <Grid item xs={0.5}>
                                    <Box mb={2}>
                                        <Badge color="primary">
                                            <ThumbUp />
                                        </Badge>
                                    </Box>
                                    <Badge color="primary">
                                        <Comment />
                                    </Badge>
                                </Grid>
                                <Grid item xs={0.5}>
                                    <Box mb={2}>
                                        <Typography>
                                            {discussion.ratings}
                                        </Typography>
                                    </Box>
                                    <Typography>
                                        {discussion.replies_count}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Link>
            ));
    }

    function tabMapper() {
        return topics.map((topic, index) => (
            <Tab key={index} label={topic} value={topic} />
        ));
    }

    function loadMore() {
        setLoadCount(loadCount + numPosts);
    }

    function switchTab(event, newValue) {
        setCurrentTopic(newValue);
        setLoadCount(numPosts);
    }

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

    // TODO: Style the UI for post previews better and add number of upvotes and replies
    return (
        <div className="discussions">
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    <Typography variant="h3" style={{ paddingBottom: '20px', color: "white" }}>
                        {courseName}
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <TextField 
                            label="Search" 
                            variant="outlined" 
                            value={searchTerm}
                            onChange={event => setSearchTerm(event.target.value)}
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
                        <Link to="/create-post" state={{cid: `${courseID}`}}>
                            <Button variant="contained" color="primary">
                                Create Post
                            </Button>
                        </Link>
                    </div>
                    <Tabs value={currentTopic}
                        onChange={switchTab}
                        indicatorColor="secondary"
                        
                    >
                        <Tab label="All" value="All" TabIndicatorProps={{textColor: "white"}}/>
                        {tabMapper()}
                    </Tabs>
                    <div >
                        {discussionMapper()}
                    </div>
                </Container>
                {(loadCount <= discussions.filter(discussion => currentTopic === 'All' || discussion.topic === currentTopic).length) ?
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
                    : null
                }
            </ThemeProvider>
        </div>
    );
}

export default Discussions;