import React, { useState } from 'react';
import {
  InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
  Box, Card, CardContent, Grid, List, ListItem, ListItemText
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#3b3b3b', // Black
      },
      secondary: {
        main: '#CEB888', // Gold
      },
    },
    typography: {
      fontFamily: 'Quicksand, sans-serif',
      fontWeightBold: 700,
    },
  });

export default function StudyPage() {
  const [text, setText] = useState('');
  const [showBox, setShowBox] = useState(false);
  const [stringList, setStringList] = useState([]);

  const handleClick = () => {
    setShowBox(true);
  };

  const handleSubmit = () => {
    if (text.trim() !== '') {
        setStringList([...stringList, text.trim()]);
        setText('');
      }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
        <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Physics 101 Study Page
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Card variant="outlined" sx={{ my: 2 }}>
                    <CardContent>
                        <Button variant="contained" onClick={handleClick}>
                            Add Study Media
                        </Button>
                        {showBox && (
                            <Box mt={2}>
                            <TextField
                                label="Enter Text"
                                variant="outlined"
                                value={text}
                                onChange={handleTextChange}
                            />
                                <Button variant="contained" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card variant="outlined" sx={{ my: 2 }}>
                    <CardContent>
                        <List>
                            {stringList.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={item} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
