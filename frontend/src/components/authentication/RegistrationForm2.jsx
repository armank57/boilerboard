import React, { useState } from "react";
// import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, Container, TextField, Collapse, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import Grid from '@mui/material/Unstable_Grid2';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function RegistrationForm2() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        conf_password: "",
    });

    const [error, setError] = useState(null);


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
            MuiAlert: {
                styleOverrides: {
                    root: {
                        fontSize: 14,
                    },
                },
            },
        },
    });

    // const disableSubmitBtn = (event) => {
    //     // const registrationForm = event.currentTarget;
    //     // if(registrationForm.checkValidity() === false) {
    //     //     // event.stopPropagation();
    //     //     return true;
    //     // }

    //     console.log("hello");

    //     if(form.first_name === "" || form.last_name === "" || form.email === "" || form.password === "" || form.conf_password === "") {
    //         return true;
    //     } else if (!form.email.includes("@purdue.edu")) {
    //         return true;
    //     } else if (form.password !== form.conf_password || form.password.length < 8) {
    //         return true;
    //     }
    //     return false;


    // }

    const errorClick = () => {
        setErrorOpen(false);
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const registrationForm = event.currentTarget;

        if(registrationForm.checkValidity() === false) {
            event.stopPropagation();
        }

        if(!form.email.includes("@purdue.edu")) {
            event.stopPropagation();
            alert("Please Provide a valid Purdue Email Address!");
            return;
        }

        if(form.conf_password !== form.password) {
            event.stopPropagation();
            alert("Passwords do not match!");
            return;
        }
        
        setValidated(true);

        const data = {
            username: form.username,
            password: form.password,
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name,
        }

        axios.post("http://localhost:8000/api/auth/register/", data).then((res) => {
            // Registering the Account and tokens in the store

            localStorage.setItem("auth", JSON.stringify({
                access: res.data.access,
                refresh: res.data.refresh,
                user: res.data.user
            }));
            navigate("/");
        }).catch((err) => {
            if(err.message) {
                console.log(err.request.response);
                const obj = JSON.parse(err.request.response);
                if(obj.email && obj.username && obj.email[0] === "user with this email already exists." && obj.username[0] === "user with this username already exists.") {
                    setErrorOpen(true);
                    setError("Email and Username Already Exists!");
                } else if (obj.email && obj.email[0] === "user with this email already exists.") {
                    setErrorOpen(true);
                    setError("Email Already Exists!");
                } else if (obj.username && obj.username[0] === "user with this username already exists.") {
                    setErrorOpen(true);
                    setError("Username Already Exists!");
                } else {
                    setErrorOpen(true);
                    setError("Fill Required Fields")
                }
            }
        }); 

    };

    return (
        <div className="Register">
            <ThemeProvider theme={theme}>
                <Container maxWidth="sm" style={{ 
                    height: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                }}>

                <Card style={{ backgroundColor: theme.palette.primary.main }}>
                    <CardContent>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <TextField
                                        label="First Name" 
                                        type="text"
                                        value={form.first_name}
                                        onChange={(e) => setForm({ ...form, first_name: e.target.value})}
                                        margin="normal"
                                        InputProps={{
                                            style: { backgroundColor: 'white' },
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'black' },
                                        }}
                                        required
                                        fullWidth
                                        placeholder="Enter your first name"
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        label="Last Name" 
                                        type="text"
                                        value={form.last_name}
                                        onChange={(e) => setForm({ ...form, last_name: e.target.value})}
                                        margin="normal"
                                        InputProps={{
                                            style: { backgroundColor: 'white' },
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'black' },
                                        }}
                                        required
                                        fullWidth
                                        placeholder="Enter your last name"
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        label="Username" 
                                        type="text"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value})}
                                        margin="normal"
                                        InputProps={{
                                            style: { backgroundColor: 'white' },
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'black' },
                                        }}
                                        required
                                        fullWidth
                                        placeholder="Enter your username"
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        label="Email" 
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value})}
                                        margin="normal"
                                        InputProps={{
                                            style: { backgroundColor: 'white' },
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'black' },
                                        }}
                                        required
                                        fullWidth
                                        error={!form.email.includes("@purdue.edu") && form.email !== ""}
                                        helperText="Please enter a valid purdue email"
                                        placeholder="Enter a valid Purdue Email address"
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        label="Password" 
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value})}
                                        margin="normal"
                                        InputProps={{
                                            style: { backgroundColor: 'white' },
                                            pattern: "[a-z]{1,15}",
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'black' },
                                        }}
                                        error={form.password.length < 8 && form.password !== ""}
                                        helperText={"Passwords must have at least 8 characters"}
                                        required
                                        fullWidth
                                        placeholder="Enter a Password with at least 8 characters"
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        label="Confirm Password" 
                                        type="password"
                                        value={form.conf_password}
                                        onChange={(e) => setForm({ ...form, conf_password: e.target.value})}
                                        margin="normal"
                                        InputProps={{
                                            style: { backgroundColor: 'white' },
                                            pattern: "[a-z]{1,15}",
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'black' },
                                        }}
                                        required
                                        fullWidth
                                        minLength="8"
                                        error={form.conf_password !== form.password && form.conf_password !== ""}
                                        helperText="*Passwords must Match"
                                        placeholder="Enter your password again"
                                    />
                                </Grid>
                                <Grid xs={6} sm={4}>
                                    <Button
                                        name="submitButton"
                                        type="submit"
                                        disabled={false}
                                        variant="contained"
                                        color="secondary"
                                        fullWidth
                                    >
                                        Create Account
                                    </Button>
                                </Grid>
                                <Grid xs={8}>
                                    <Collapse in={errorOpen}>
                                        <Alert
                                            severity="error"
                                            fullWidth
                                            action={<IconButton onClick={errorClick}><CloseIcon></CloseIcon></IconButton>}
                                        >{error}</Alert>
                                    </Collapse>
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

export default RegistrationForm2; 