import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function ResetPassword() {
    const [email, setEmail] = useState('');

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
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                    },
                },
            },
        },
    });

    const resetPasswordHandler = (e) => {
        e.preventDefault();
        
        console.log('Email:', email);

        // TODO: Send email to server to reset password
    };

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
                    <Typography variant="h3" style={{ paddingBottom: '20px', color: "white" }}>
                        Reset Password
                    </Typography>
                    <Card style={{ backgroundColor: theme.palette.primary.main }}>
                        <CardContent>
                            <Box component="form" onSubmit={resetPasswordHandler}>
                                <Grid container spacing={2}>
                                    <Grid xs={12}>
                                        <Typography>
                                            Enter your email address and we will send you a link to reset your password if there is an account associated with that email.
                                        </Typography>
                                    </Grid>
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
                                        <Button
                                            name="resetPassword"
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                        >
                                            Reset Password
                                        </Button>
                                    </Grid>
                                    <Grid xs={12}>
                                        <Typography align="right">
                                            <Link to="/" style={{ textDecoration: 'none' }}>
                                                Back to Log In
                                            </Link>
                                        </Typography>
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

export default ResetPassword;