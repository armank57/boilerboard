import { React, useState } from 'react';
import './LogIn.css';
import { Box, TextField, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const theme = createTheme({
        palette: {
            primary: {
                main: '#3b3b3b', // Black
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
    
    const loginHandler = (e) => {
        e.preventDefault();
        
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Log in');
    };

    return (
        <div className="LogIn">
            <Box component="form" onSubmit={loginHandler}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Purdue Email Address"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Log In
                </Button>
            </Box>
        </div>
    );
}

export default LogIn;