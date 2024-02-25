import './LogIn.css';
import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function LogIn() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const createAccountHandler = () => {
        console.log('Create Account');
        navigate('/create-account');
    };
    
    const loginHandler = async (e) => {
        e.preventDefault();

        console.log('Email:', email);
        console.log('Password:', password);

        // TODO: Send email and password to server
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/', {
                username: email, // replace with the name of your username field
                password: password, // replace with the name of your password field
            });

            if (response.data.access) {
                // Login successful
                console.log('Login successful:', response.data);
                // You can save the tokens in local storage or context
                localStorage.setItem('access', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                // Redirect to home page or dashboard
            } else {
                // Login failed
                alert('Login failed:', response.data);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    return (
        <div className="login">
            <ThemeProvider theme={theme}>
                <Container maxWidth="sm" style={{ 
                    height: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                }}>
                    <Typography variant="h3" style={{ paddingBottom: '20px' }}>
                        Log In
                    </Typography>
                    <Card style={{ backgroundColor: theme.palette.primary.main }}>
                        <CardContent>
                            <Box component="form" onSubmit={loginHandler}>
                                <Grid container spacing={2}>
                                    <Grid xs={12}>
                                        <TextField
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter Purdue Email Address"
                                            variant="outlined"
                                            margin="normal"
                                            InputProps={{
                                                style: { backgroundColor: 'white' },
                                            }}
                                            InputLabelProps={{
                                                style: { color: 'black' },
                                            }}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <TextField
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter Password"
                                            variant="outlined"
                                            margin="normal"
                                            InputProps={{
                                                style: { backgroundColor: 'white' },
                                            }}
                                            InputLabelProps={{
                                                style: { color: 'black' },
                                            }}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <Typography align="right">
                                            <Link to="/reset-password" style={{ textDecoration: 'none' }}>
                                                Forgot Password?
                                            </Link>
                                        </Typography>
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Button
                                            name="createAccount"
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={createAccountHandler}
                                        >
                                            Create Account
                                        </Button>
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Button
                                            name="logIn"
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                        >
                                            Log In
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default LogIn;