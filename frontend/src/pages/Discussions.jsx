import { React, useState, useEffect } from 'react';
import { Card, CardContent, Container, Typography, TextField, Grid, Button, Menu, MenuItem} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";


function Discussions() {
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery]  = useState("");
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const [sortOption, setSortOption] = useState(1);
    // const [discussionsFiltered, setDiscussionsFiltered] = useState(discussions);
    
    const handleDropDownClick = (event) => {
        setAnchorEl(event.target.value);
        setDropDownOpen(true)
        console.log(event.target.value)
        // dropDownOpen = true;
    }
    
    const handleDropDownClose = (e) => {
        setAnchorEl(null);
        setDropDownOpen(false);
        setSortOption(e.target.value);
    }

    const filterData = ((query, data) => {
        if (!query) {
            return data;
        } else if (!data) {

        } else {
            const result = [];
            for(let i = 0; i < data.length; i++) {
                if(data.name && data.name.includes(query)) {
                    result[i] = data.name;
                }
            }
            return result;
            // return data.filter((d) => d.name.toLowerCase().includes(query));
        }
    });

    



    const handleSearch = (e) => {
        e.preventDefault();
        console.log("change");
        setSearchQuery(...searchQuery, e.target.value)

    };



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
        MuiTextField: {
                styleOverrides: {
                root: {
                    "& .MuiStandardInput-root": {
                    "&:hover fieldset": {
                        borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "blue",
                    },
                    },
                },
            },
        },
    });


    const SearchBar = () => (
        <form>
            <TextField
                id="search-bar"
                // value=
                className="text"
                onChange={handleSearch}
                sx={{ input: { color: 'white' } }}
                label="Enter a Discussion Name"
                placeholder="Search..."
                variant="standard"
                size="small"
            />
            <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "white" }} />
            </IconButton>
        </form>
    );


    useEffect(() => {
        // TODO: Replace with your actual API endpoint
        // setDiscussions([
        //     {title: 'Discussion 1', content: 'This is the first discussion.'},
        //     {title: 'Discussion 2', content: 'This is the second discussion. Testing very long discussion with a lot of words to see how it overflows because blah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah blablah blah Hello.'}
        // ]);

        // TODO: Set discussions from back-end API
        axios.get('http://localhost:8000/api/discussion/')
            .then(response => {
                setDiscussions(response.data);
                console.log(response.data[0].rating)
            })
            .catch(error => {
                console.error('Error fetching discussions:', error);
            });
    }, []);

    function compareByRating(a, b) {
        return a.rating - b.rating
    }
    function compareByCreated(a, b) {
        return a.created - b.created;
    }
    function compareByUpdate(a, b) {
        return a.updated - b.updated;
    }

    const discussionMapper = () => {
        const discussionsFiltered = discussions.filter((d) => {
            if(!searchQuery || searchQuery === "")  {
                console.log("filter");
                return d;
            } else {
                console.log("filter");
                return d.name.toLowerCase().includes(searchQuery);
            }
        });
        const discussionSort = () => {
            if(sortOption === 2) {
                return discussionsFiltered.sort(compareByRating)
            } else if (sortOption === 1){
                return discussionsFiltered.sort(compareByCreated)
            } else {
                return discussionsFiltered.sort(compareByUpdate)
            }
        }

        return discussionsFiltered.sort((a, b) => sortOption === 2 ? a.rating - b.rating : sortOption === 1 ? a.created-b.created : a.updated - b.updated).map((discussion, index) => (
            <Card key={index} style={{
                backgroundColor: theme.palette.primary.main,
                marginBottom: '20px',
                height: '100px',
                overflow: 'hidden'
            }}>
                <CardContent>
                    <Grid container direction="row" display="flex" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">
                                {discussion.name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography varient="h5">
                                {discussion.rating}
                            </Typography>
                        </Grid>
                    </Grid>
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
                        <Grid item style={{paddingTop:"16px"}}>
                            <Grid container direction="column" display="flex">
                                <Grid item>
                                    <Button
                                        id="basic-button"
                                        aria-controls={dropDownOpen ? 'basic-menu' : ""}
                                        aria-haspopup="true"
                                        aria-expanded={dropDownOpen ? 'true' : ""}
                                        onClick={handleDropDownClick}
                                    >
                                        Sort
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={dropDownOpen}
                                        onClose={handleDropDownClose}
                                        anchorOrigin={{
                                            vertical: "",
                                            horizontal: "center"
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "left"
                                        }}
                                        MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleDropDownClose} value={1}>Created</MenuItem>
                                        <MenuItem onClick={handleDropDownClose} value={2}>Rating</MenuItem>
                                        <MenuItem onClick={handleDropDownClose} value={3}>Updated</MenuItem>
                                    </Menu>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item style={{paddingTop: "8px"}}>
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

