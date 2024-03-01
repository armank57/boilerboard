import { React } from 'react';
// import axios from 'axios';
import { Container, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';


function ResetPasswordSentDialouge() {

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
                        Check Your Email!
                    </Typography>
                    <Typography variant="p" style={{ paddingBottom: '20px', color: 'white' }}>
                        If you have an account with us, we will send you an email with a link to 
                        reset your password shortly. 
                    </Typography>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default ResetPasswordSentDialouge;