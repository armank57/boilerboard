import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
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

function AdminPanelHome() {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedUserForRole, setSelectedUserForRole] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([
    { id: 'Admin', name: 'Admin' },
    { id: 'Instructor', name: 'Instructor' },
    { id: 'Student', name: 'Student' },
  ]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get_users/');
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };
  
    fetchUsers();
  }, []);

  const handleManageRole = () => {
    const user = users.find(user => user.public_id === selectedUserForRole);

    const isSameRole = (
      (selectedRole === 'Admin' && user.is_superuser) ||
      (selectedRole === 'Instructor' && user.is_instructor) ||
      (selectedRole !== 'Admin' && selectedRole !== 'Instructor' && !user.is_superuser && !user.is_instructor)
    );
  
    if (isSameRole) {
      toast.error('New role is the same as old role');
      return;
    }
  
    const requestData = {
      id: selectedUserForRole,
      role: selectedRole
    };
  
    axios.post('http://localhost:8000/api/change_role/', requestData)
      .then(response => {
        console.log(response);
        toast.success('Role changed successfully');
      })
      .catch(error => {
        console.error('There was an error!', error);
        toast.error('Failed to change role');
      });
  };
  

  const handleCreateCourse = () => {
    if (!courseName || !courseDescription) {
      toast.error('Both fields are required to create a course');
      return;
    }
    
    const requestData = {
      name: courseName,
      description: courseDescription
      //course_subject:, creator:
    };
  
    axios.post('http://localhost:8000/api/course/', requestData)
      .then(response => {
        console.log(response);
        // Reset the input fields after successful creation
        setCourseName('');
        setCourseDescription('');
        toast.success('Course created successfully');
      })
      .catch(error => {
        console.error('There was an error!', error);
        toast.error('Failed to create course');
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
              Create Course
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
            <Button variant="contained" color="secondary" onClick={handleCreateCourse}>
              Create Course
            </Button>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Manage User Roles
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
              <InputLabel id="manage-user-label">Select a user</InputLabel>
              <Select
                labelId="manage-user-label"
                label="Select a user"
                defaultValue=""
                value={selectedUserForRole}
                onChange={(e) => setSelectedUserForRole(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.public_id} value={user.public_id}>
                    Username: {user.username}, First Name: {user.first_name}, Last Name: {user.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
              <InputLabel id="manage-role-label">Select a role</InputLabel>
              <Select
                labelId="manage-role-label"
                label="Select a role"
                defaultValue=""
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="secondary" onClick={handleManageRole}>
              Change Role
            </Button>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default AdminPanelHome;
