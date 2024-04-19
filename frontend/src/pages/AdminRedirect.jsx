import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Container, Typography, Grid, Card, CardContent, Chip, Badge, CircularProgress, getAccordionSummaryUtilityClass } from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getUser, useUserActions } from "../hooks/user.actions";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Image from "material-ui-image";

const adminLink = 'http://127.0.0.1:8000/admin'

function AdminRedirect() {
    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
            primary: {
                main: '#3b3b3b', // Black
            },
            secondary: {
                main: '#ceb888', // Gold
            },
        },
    });

    

    return (
        <ThemeProvider theme={theme}>
            <Box textAlign='center' paddingTop="50px">
                <Typography variant="h2" style={{color: "white", paddingBottom: "50px", fontFamily: "EB Garamond"}}>
                    BoilerBoard Administration
                </Typography>
                <Button href={adminLink} variant="contained" color="secondary" style={{justifyContent: "center"}} > 
                    Go To Admin Panel <ArrowCircleRightIcon color="primary" ></ArrowCircleRightIcon>
                </Button>
            </Box>
        </ThemeProvider>
    );
}

export default AdminRedirect;