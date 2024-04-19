import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Container, Typography, IconButton, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';
import DailyIframe from '@daily-co/daily-js';
import { getUser, useUserActions } from "../hooks/user.actions";
import BlockSharpIcon from '@mui/icons-material/BlockSharp';

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
        color: '#D3D3D3',
        secondarycolor: '#A4A4A4',
    },
});

function VoiceChatApp() {
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [wasKicked, setWasKicked] = useState(false);
    const callRef = useRef();
    const user = getUser();
    const userActions = useUserActions();

    let userToken = localStorage.getItem('auth');
    userToken = JSON.parse(userToken).access;
    let userName = JSON.parse(localStorage.getItem('auth')).user.username;
    let dailyToken = '6baf453028501054b40fe396a23dafb4dc6a29ffa38886101b20427f95b87b59';
    let dailyOwnerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvIjp0cnVlLCJkIjoiYWMzNjIyMmItYjI5Mi00OWNiLThiOWItMDU2NDU2ZmJhZWJkIiwiaWF0IjoxNzEyNTQ5MTQ0fQ.-1FKoG5lgs01SyfH_fH2ZTOb9mBtGv7Rev0hvfj0pIw';

    const fetchRooms = () => {
        axios.get('http://localhost:8000/api/voice_chat/', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(response => setRooms(response.data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        // Fetch all rooms when the component mounts
        fetchRooms();
        const intervalId = setInterval(fetchRooms, 3000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (joinedRoom) {
            const updatedJoinedRoom = rooms.find(room => room.id === joinedRoom.id);
            setJoinedRoom(updatedJoinedRoom);
        }
    }, [rooms, joinedRoom]);

    useEffect(() => {
        // Add event listener for beforeunload event
        window.addEventListener('beforeunload', (event) => {
            if (joinedRoom) {
                handleLeaveRoom(joinedRoom.id);
            }
        });
    
        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('beforeunload', (event) => {
                if (joinedRoom) {
                    handleLeaveRoom(joinedRoom.id);
                }
            });
        };
    }, [joinedRoom]);

    useEffect(() => {
        if (joinedRoom) {
            console.log(joinedRoom.banned_users);
            console.log(JSON.parse(localStorage.getItem('auth')).user.id);
            const userId = JSON.parse(localStorage.getItem('auth')).user.id;
            const isBanned = joinedRoom.banned_users.some(user => user.public_id.replace(/-/g, '') === userId);
            if (isBanned) {
                // Refresh the page
                window.location.reload();
            }
        }
    }, [joinedRoom]);

    const handleCreateRoom = () => {
        // Check if the room name only contains letters and numbers
        const isValidRoomName = /^[a-zA-Z0-9_]+$/.test(roomName);
        if (!isValidRoomName) {
            toast.error('Room name can only contain letters and numbers, and underscores.');
            return Promise.reject(new Error('Invalid room name'));
        }
        // Create daily room
        const createDailyRoom = axios.post('https://api.daily.co/v1/rooms', {
            name: roomName,
            privacy: 'public',
            properties: {
                start_video_off: true,
                enable_prejoin_ui: false,
                //enable_people_ui: false,
            },
        }, {
            headers: {
                'Authorization': `Bearer ${dailyToken}`
            }

        });
       
        // Create a new room
        const createRoom = axios.post('http://localhost:8000/api/voice_chat/', { 
            name: roomName,
            is_private: isPrivate,
        }, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
     
        return Promise.all([createDailyRoom, createRoom])
            .then(([dailyResponse, roomResponse]) => {
                console.log(dailyResponse.data);
                const newRoomId = roomResponse.data.id;
                setRooms([...rooms, roomResponse.data]);
                toast.success('Room successfully created');
                setRoomName('');
                return newRoomId;
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to create room');
                throw error;
            });
     };

    const handleDeleteRoom = (roomId, roomName) => {
        // Delete a room
        axios.delete(`http://localhost:8000/api/voice_chat/${roomId}/`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(() => {
                setRooms(rooms.filter(room => room.id !== roomId));
                toast.success('Room successfully deleted');

                axios.delete(`https://api.daily.co/v1/rooms/${roomName}`, {
                    headers: {
                        'Authorization': `Bearer ${dailyToken}`
                    }
                })
                .then(() => {
                    console.log('Room successfully deleted in Daily API');
                })
                .catch(error => {
                    console.error(error);
                });

            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.status === 403) {
                    toast.error('You are not authorized to delete this room');
                } else {
                    toast.error('An error occurred');
                }
            });

    };

    const handleJoinRoom = (roomId) => {
        return axios.post(`http://localhost:8000/api/voice_chat/${roomId}/join/`, {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(response => {
                const joinedRoom = rooms.find(room => room.id === roomId);
                setJoinedRoom(joinedRoom);
                fetchRooms();
                toast.success('Joined room successfully');

                // Create a Daily.co video call iframe
                callRef.current = DailyIframe.createFrame({
                    userName: userName,
                    showUserNameChangeUI: false,
                    showLeaveButton: false,
                    iframeStyle: {
                        position: 'relative',
                        width: '100%',
                        height: '500px',
                    },
                });
                
                // Join the Daily.co video call
                console.log(joinedRoom.creator);
                console.log(userName);
                if (joinedRoom.creator === userName) {
                    callRef.current.join({
                        url: `https://boilerboard.daily.co/${joinedRoom.name}`,
                        token: dailyOwnerToken,
                    });
                } else {
                    callRef.current.join({
                        url: `https://boilerboard.daily.co/${joinedRoom.name}`,
                    });
                }
                return joinedRoom;
            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.status === 403) {
                    toast.error('You are banned from this room');
                } else {
                    toast.error('Failed to join room');
                }
            });
     };
          

    const handleLeaveRoom = (roomId) => {
        axios.post(`http://localhost:8000/api/voice_chat/${roomId}/leave/`, {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(() => {
                setJoinedRoom(null);
                fetchRooms();
                toast.success('Left room successfully');

                // Destroy the iframe when leaving the room
                console.log('leaving');
                window.location.reload();
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to leave room');
            });
    };

    const handleCreateAndJoinRoom = async () => {
        try {
            const newRoomId = await handleCreateRoom();
            console.log('returned id', newRoomId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleKickUser = (roomId, userId) => {
        const currentUserId = JSON.parse(localStorage.getItem('auth')).user.id.replace(/-/g, '');
        const tempUserId = userId.replace(/-/g, '');
        console.log(tempUserId, currentUserId);
        if (tempUserId === currentUserId) {
            toast.error('You cannot kick yourself');
            return;
        }
    
        axios.post(`http://localhost:8000/api/voice_chat/${roomId}/kick/`, { user_id: userId }, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(() => {
                fetchRooms();
                toast.success('User successfully kicked');
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to kick user');
            });
    };

    const handleRequestToJoinRoom = (roomId) => {
        return axios.post(`http://localhost:8000/api/voice_chat/${roomId}/request_to_join/`, {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(response => {
                toast.success('Request to join room sent successfully');
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to send request to join room');
            });
    };

    const handleApproveUser = (roomId, userId) => {
        return axios.post(`http://localhost:8000/api/voice_chat/${roomId}/approve_user/`, { user_id: userId }, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(response => {
                toast.success('User approved successfully');
                fetchRooms();
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to approve user');
            });
    };

    if(user.blacklisted_from_study_sessions) {
        return (
            <div className="Restricted">
                <ThemeProvider theme={theme}>
                    <Container maxWidth="sm" style={{ 
                        height: '50vh', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                    }}>
                        <Grid container direction="row" sx={{}}>
                            <BlockSharpIcon style={{color: "white", height: "50", width: "50"}} ></BlockSharpIcon>
                            <Typography variant="h3" style={{ paddingBottom: '20px', paddingLeft: "40px", color: "white", fontFamily: "Helvetica Neue" }}>
                                UNAUTHORIZED
                            </Typography>
                        </Grid>
                        
                        <Typography variant="p" style={{ paddingBottom: '20px', color: "white"}}>
                            You have been restricted access to view study rooms. Please contact your Administrator for more details.
                        </Typography>
                    </Container>
                </ThemeProvider>
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Toaster />
            <Container maxWidth="sm">
                <Typography variant="h3" style={{ paddingBottom: '20px', color: theme.typography.color}}>
                    Voice Chat Rooms
                </Typography>
                <TextField
                    label="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        style: { color: theme.typography.color },
                    }}
                    InputProps={{
                        style: { color: theme.typography.color },
                    }}
                />
                <Grid container alignItems="center" justifyContent="flex-end">
                    <Grid item xs={1}>
                        <Tooltip title={isPrivate ? "Private Room" : "Public Room"}>
                            <IconButton
                                color={isPrivate ? "primary" : "default"}
                                onClick={() => setIsPrivate(!isPrivate)}
                            >
                                {isPrivate ? <LockIcon /> : <LockOpenIcon />}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCreateAndJoinRoom}
                            fullWidth
                        >
                            Create Room
                        </Button>
                    </Grid>
                </Grid>
                {/* <Switch
                    checked={isPrivate}
                    onChange={(event) => setIsPrivate(event.target.checked)}
                    name="isPrivate"
                    color="secondary"
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCreateAndJoinRoom}
                    fullWidth
                >
                    Create Room
                </Button> */}
                <List>
                    {rooms.map((room) => (
                        <ListItem key={room.id.toString()}>
                            <ListItemText 
                                primary={room.name}
                                primaryTypographyProps={{ style: { color: theme.typography.secondarycolor } }}
                                secondaryTypographyProps={{ style: { color: theme.typography.color } }}
                                secondary={
                                    <>
                                        {`Created by: ${room.creator}`}
                                        <br />
                                        {`Online users: ${room.online_users.length}`}
                                        <br />
                                        {`Room type: ${room.is_private ? 'Private' : 'Public'}`}
                                    </>
                                }
                                //secondary={`Created by: ${room.creator} Online users: ${room.online_users.length}`} 
                            />
                            {joinedRoom && joinedRoom.id === room.id ? (
                                <Button variant="contained" color="primary" onClick={() => handleLeaveRoom(room.id)}>Leave</Button>
                            ) : (
                                room.is_private && room.creator !== userName ? (
                                    room.waiting_users.some(user => user.username === userName) ? (
                                        <Button variant="contained" color="primary" disabled style={{ backgroundColor: '#ceb888' }}>Join Request Sent</Button>
                                    ) : room.accepted_users.some(user => user.username === userName) ? (
                                        <Button variant="contained" color="secondary" onClick={() => handleJoinRoom(room.id)}>Approved to Join</Button>
                                    ) : (
                                        <Button variant="contained" color="secondary" onClick={() => handleRequestToJoinRoom(room.id)}>Request to Join</Button>
                                    )
                                ) : (
                                    <Button variant="contained" color="secondary" onClick={() => handleJoinRoom(room.id)}>Join</Button>
                                )
                            )}
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoom(room.id, room.name)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                {joinedRoom && joinedRoom.is_private && joinedRoom.creator === userName && (
                    <>
                        <Typography variant="h6" style={{ paddingTop: '20px' ,color: theme.typography.secondarycolor}}>
                            Waiting users in {joinedRoom.name}:
                        </Typography>
                        <List>
                            {joinedRoom.waiting_users.map((user) => {
                                return (
                                    <ListItem key={user.id}>
                                        <ListItemText primary={user.username} style={{ color: theme.typography.color }}/>
                                        <Button variant="contained" color="primary" onClick={() => handleApproveUser(joinedRoom.id, user.public_id)}>Approve</Button>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>
                )}
                {joinedRoom && (
                    <>
                        <Typography variant="h6" style={{ paddingTop: '20px' ,color: theme.typography.secondarycolor}}>
                            Online users in {joinedRoom.name}:
                        </Typography>
                        <div ref={callRef} />
                        <List>
                        {joinedRoom.online_users.map((user) => {
                            return (
                                <ListItem key={user.id}>
                                    <ListItemText primary={user.username} style={{ color: theme.typography.color }}/>
                                    {joinedRoom.creator === userName && (
                                    <Tooltip title="Kicked users will be banned from this room">
                                        <Button variant="contained" color="secondary" onClick={() => handleKickUser(joinedRoom.id, user.public_id)}>Kick</Button>
                                    </Tooltip>
                                    )}
                                </ListItem>
                            );
                        })}
                        </List>
                    </>
                )}
            </Container>
        </ThemeProvider>
    );
}

export default VoiceChatApp;