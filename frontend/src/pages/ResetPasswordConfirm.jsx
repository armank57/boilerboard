import '../styling/LogIn.css';
import { React, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUserActions } from "../hooks/user.actions";

function ResetPasswordConfirm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        password: "",
        conf_password: "",
    });
    const userActions = useUserActions();
    const [queryParameters] = useSearchParams()


    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO
        // console.log("hello");
       //  navigate("/reset-password-dialouge/");
       // TODO pass public key and token thru data
        const data = { 
            password: form.password 
        }
        const public_id = queryParameters.get('public_id');
        const token = queryParameters.get('token');
        try{
            userActions.resetPassword(data, public_id, token);
        } catch (error) {
            alert(error.message);
        }

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
                    <Typography variant="h3" style={{ paddingBottom: '20px', color: 'white' }}>
                        Reset Password
                    </Typography>
                    <Card style={{ backgroundColor: theme.palette.primary.main }}>
                        <CardContent>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid xs={12}>
                                        <TextField
                                            label="Password"
                                            type="password"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value})}
                                            placeholder="Enter Purdue Email Address"
                                            variant="outlined"
                                            margin="normal"
                                            InputProps={{
                                                style: { backgroundColor: 'white' },
                                            }}
                                            InputLabelProps={{
                                                style: { color: 'black' },
                                            }}
                                            error = {form.password.length < 8 && form.password !== ""}
                                            helperText="*Passwords must have at least 8 characters!"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12}>
                                        <TextField
                                            label="Confirm Password"
                                            type="password"
                                            value={form.conf_password}
                                            onChange={(e) => setForm({ ...form, conf_password: e.target.value})}
                                            placeholder="Enter Password"
                                            variant="outlined"
                                            margin="normal"
                                            InputProps={{
                                                style: { backgroundColor: 'white' },
                                            }}
                                            InputLabelProps={{
                                                style: { color: 'black' },
                                            }}
                                            error={form.conf_password !== form.password && form.conf_password !== ""}
                                            helperText="*Passwords Must Match"
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                        <Button
                                            name="logIn"
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            fullWidth                                        >
                                            Reset Password
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

export default ResetPasswordConfirm;