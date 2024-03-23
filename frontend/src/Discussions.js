import { React, useState, useEffect } from 'react';
import { Button, Card, CardContent, Container, MenuItem, Select, Tabs, Tab, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Link } from 'react-router-dom';

// TODO: Configure back end properly
// TODO: Display only top 10 posts based on recency
// Add a button to view more posts

function Discussions() {
    const numPosts = 5; // Number of posts to display initially + load more
    
    const [discussions, setDiscussions] = useState([]); // State for discussions array which consists of posts that are fetched from database
    const [discLength, setDiscLength] = useState(numPosts); // State for discussions length
    const [loadCount, setLoadCount] = useState(numPosts); // State for load count, used for loading more discussions
    const [currentTopic, setCurrentTopic] = useState('All'); // State for current topic, used for filtering discussions

    // Static list of topics to tab-by
    const topics = ['General', 'Homework', 'Exams', 'Projects', 'Labs', 'Quizzes', 'Other']; 

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
        // TODO: Replace with your actual API endpoint

        // The following setDiscussions is filler content with several discussions
        // that should be deleted once the back-end API is set up
        // TODO: Link discussions to each course they are a part of
        axios.get('http://127.0.0.1:8000/api/post/', {
            headers: {
                'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
            }
        })
            .then(response => {
                setDiscussions(response.data);
                console.log(discussions);
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
            }
        );
        setDiscLength(discussions.length);
    }, [loadCount, discLength, currentTopic]);

    function discussionMapper() {
        return discussions
            .filter(discussion => currentTopic === 'All' || discussion.topic === currentTopic) // Filter discussions based on currentTopic
            .slice(0, loadCount)
            .map((discussion, index) => (
                <Card key={index} style={{ 
                    backgroundColor: theme.palette.primary.main, 
                    marginBottom: '20px',
                    height: '100px',
                    overflow: 'hidden'
                }}>
                    <CardContent>
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
                    </CardContent>
                </Card>
        ));
    }

    function tabMapper() {
        return topics.map((topic, index) => (
                <Tab key={index} label={topic} value={topic} />
            ));
    }

    function loadMore() {
        setLoadCount(loadCount + numPosts);
        console.log(loadCount, discLength);
    }

    function switchTab(event, newValue) {
        setCurrentTopic(newValue);
        setLoadCount(numPosts);
    }

    // TODO: Connect this discussions page to a course
    // TODO: Implement sorting and searching
    // TODO: Style the UI for post previews better and add number of upvotes and replies
    // TODO: Create a new post button that links to a new post page
    return (
        <div className="discussions">
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    <Typography variant="h3" style={{ paddingBottom: '20px' }}>
                        Course Name
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <TextField label="Search" variant="outlined" />
                        <Select variant="outlined">
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="popularity">Popularity</MenuItem>
                            {/* Add more options as needed */}
                        </Select>
                        <Button variant="contained" color="primary" onClick={() => window.open('/create-post', '_blank')}>
                            Create Post
                        </Button>
                    </div>
                    <Tabs value={currentTopic} 
                        onChange={switchTab}
                        indicatorColor="secondary"
                    >
                            <Tab label="All" value="All" />
                            {tabMapper()}
                    </Tabs>
                    <div>
                        {discussionMapper()}
                    </div>
                </Container>
                { (loadCount <= discussions.filter(discussion => currentTopic === 'All' || discussion.topic === currentTopic).length) ?
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