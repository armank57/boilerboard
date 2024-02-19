import { React, useState } from 'react';
import './CourseHub.css';
import { Box, TextField, Button, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TopBar from './TopBar';

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

function CourseHub() {
    return(
        <ThemeProvider theme={theme}>
            <TopBar />
        </ThemeProvider>
    );
}

export default CourseHub;