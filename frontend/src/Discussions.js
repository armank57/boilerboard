import { React, useState, useEffect } from 'react';
import { Button, Card, CardContent, Container, Tabs, Tab, Typography } from '@mui/material';
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
        setDiscussions([
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'Homework'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'Homework'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'Exams'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'Exams'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 1', content: 'This is the first discussion.', topic: 'General'},
            {title: 'Discussion 2', content: 'This is the second discussion. Testing very long discussion with a lot of words to see how it overflows because blah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah Hello.', topic: 'Homework'}
        ]);
        // TODO: Set discussions from back-end API
        axios.get('http://localhost:8000/api/discussions/')
            .then(response => {
                setDiscussions(response.data);
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
        return discussions
            .map(discussion => discussion.topic)
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .map((topic, index) => (
                <Tab key={index} label={topic} value={topic} />
            ));
    }

    function loadMore() {
        setLoadCount(loadCount + numPosts);
        console.log(loadCount, discLength);
    }

    function switchTab(event, newValue) {
        setCurrentTopic(newValue);
    }

    return (
        <div className="discussions">
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    <Typography variant="h3" style={{ paddingBottom: '20px' }}>
                        Discussions
                    </Typography>
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