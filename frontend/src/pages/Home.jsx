// TEMPORARY PAGE - REPLACE WITH ACTUAL HOMESCREEN

import React from "react";
import { getUser, useUserActions } from "../hooks/user.actions";
import "../styling/Home.css";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Home() {
    const user = getUser();
    const userActions = useUserActions();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!user) {
        return <div>Loading!</div>;
    }

    const handleLogout = (event) => {
        userActions.logout();
    }

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

    return (
        <div>
            <div>
                <h1 style={{color: "white"}}>{user.username.toUpperCase()}</h1>
                <p style={{color: "white"}}>Welcome {user.first_name} {user.last_name} to BoilerBoard!</p>
            </div>
            <ThemeProvider theme={theme}>
                <Button style={{
                    backgroundColor: theme.palette.secondary.main,
                    color: "black",
                    width: "100px",
                    height: "40px",
                    left: "0.5%"
                }} onClick={handleLogout}>
                    Logout
                </Button>
            </ThemeProvider>
        </div>
    );
}

export default Home;