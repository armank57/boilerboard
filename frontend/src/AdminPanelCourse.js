import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  InputLabel, FormControl, AppBar, Toolbar, 
  Button, TextField, Select, MenuItem, Typography,
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

function AdminPanelCourse() {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [removalReason, setRemovalReason] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/users/`);
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };
  
    fetchUsers();
  }, [courseId]);

  const handleUpdateCourse = () => {
    if (!courseName || !courseDescription) {
      toast.error('Both fields are required to update a course');
      return;
    }

    const updatedCourse = {
      name: courseName,
      description: courseDescription,
    };

    fetch(`http://localhost:8000/api/course/${courseId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCourse),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Course updated successfully');
          toast.success('Course updated successfully');
        } else {
          console.log('Failed to update course');
          toast.error('Failed to update course');
        }
      })
      .catch((error) => {
        console.log('Error occurred while updating course:', error);
        toast.error('Error occurred while updating course');
      });
  }; 

  const handleRemoveUser = () => {
    if (!selectedUser) {
      toast.error('No user selected for removal');
      return;
    }

    if (!removalReason) {
      toast.error('Removal message is required');
      return;
    }

    axios.delete(`http://localhost:8000/api/courses/${courseId}/users/`, {
      data: { user_id: selectedUser },
    })
      .then((response) => {
        console.log('User removed successfully');
        // Update the list of users
        setUsers(users.filter(user => user.id !== selectedUser));
        toast.success('User removed successfully');
      })
      .catch((error) => {
        console.log('Failed to remove user:', error);
        toast.error('Failed to remove user');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ m: 2 }}>
        <Card variant="outlined" sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Remove User from Course
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
              <InputLabel id="remove-user-label">Select a user</InputLabel>
              <Select
                labelId="remove-user-label"
                label="Select a user"
                defaultValue=""
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    Username: {user.username}, First Name: {user.first_name}, Last Name: {user.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              multiline
              rows={4}
              placeholder="Enter reason for removal"
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
              sx={{ my: 1, width: '100%' }}
            />
            <Button variant="contained" color="secondary" onClick={handleRemoveUser}>
              Remove User
            </Button>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Update Course Information
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              sx={{ my: 1, width: '100%' }}
            />
            <TextField
              variant="outlined"
              multiline
              rows={4}
              placeholder="Course description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              sx={{ my: 1, width: '100%' }}
            />
            <Button variant="contained" color="secondary" onClick={handleUpdateCourse}>
              Update Course
            </Button>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default AdminPanelCourse;
