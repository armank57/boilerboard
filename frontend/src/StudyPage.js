import React, { useState } from 'react';
import {
  InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
  Box, Card, CardContent
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
  return (
    <Button variant="contained">Hello world</Button>
  );
}