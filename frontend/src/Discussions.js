import { React, useState, useEffect } from 'react';
import { Card, CardContent, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

function Discussions() {
    const [discussions, setDiscussions] = useState([]);

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
        setDiscussions([
            {title: 'Discussion 1', content: 'This is the first discussion.'},
            {title: 'Discussion 2', content: 'This is the second discussion. Testing very long discussion with a lot of words to see how it overflows because blah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah Hello.'}
        ]);

        // TODO: Set discussions from back-end API
        axios.get('http://localhost:8000/api/discussions')
            .then(response => {
                setDiscussions(response.data);
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
            });
    }, []);

    function discussionMapper() {
        return discussions.map((discussion, index) => (
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

    return (
        <div className="discussions">
            <ThemeProvider theme={theme}>
                <Container maxWidth="md">
                    <Typography variant="h3" style={{ paddingBottom: '20px' }}>
                        Discussions
                    </Typography>
                    <div>
                        {discussionMapper()}
                    </div>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default Discussions;