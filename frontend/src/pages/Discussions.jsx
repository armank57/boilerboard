import { React, useState, useEffect } from 'react';
import { Card, CardContent, Container, Typography, TextField, Grid} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";


function Discussions() {
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery]  = useState("")

    const filterData = ((query, data) => {
        if (!query) {
          return data;
        } else if (!data) {

        } else {
            
          return data.filter((d) => d.name.toLowerCase().includes(query));
        }
    });

    const dataFiltered = filterData(searchQuery, discussions);

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

    

    const SearchBar = ({setSearchQuery}) => (
        <form>
            <TextField 
                id="search-bar"
                className="text"
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
                style= {{
                    background: theme.palette.primary.main
                }}
                label="Enter a Discussion Name"
                placeholder="Search..."
                variant="outlined"
                size="small"
            />
            <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "white" }} />
            </IconButton>
        </form>
    );

    useEffect(() => {
        // TODO: Replace with your actual API endpoint
        setDiscussions([
            {title: 'Discussion 1', content: 'This is the first discussion.'},
            {title: 'Discussion 2', content: 'This is the second discussion. Testing very long discussion with a lot of words to see how it overflows because blah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah Hello.'}
        ]);

        // TODO: Set discussions from back-end API
        axios.get('http://localhost:8000/api/discussion/')
            .then(response => {
                setDiscussions(response.data);
                console.log(response.data[0].name)
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
                        {discussion.name}
                    </Typography>
                    <Typography variant="body1" style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {discussion.description}
                    </Typography>
                </CardContent>
            </Card>
        ));
    }

    return (
        <div className="discussions">
            <ThemeProvider theme={theme}>
                <Container maxWidth="md" style={{paddingTop: "20px" }}>
                    <Grid container direction="row" display="flex" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h3" style={{ paddingBottom: '20px', color: "white" }}>
                                Discussions 
                            </Typography>    
                        </Grid>
                        <Grid item style={{paddingTop: "10px"}}>
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        </Grid>
                    </Grid>
                    <div>
                        {discussionMapper()}
                    </div>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default Discussions;