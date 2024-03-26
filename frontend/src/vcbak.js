import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Container, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';
// import { Daily } from 'daily-js';

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

// const daily = new Daily({
//     domain: 'boilerboard.daily.co',
//     apiKey: '6baf453028501054b40fe396a23dafb4dc6a29ffa38886101b20427f95b87b59',
// });

function VoiceChatApp() {
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(null);
    // const [voiceChatRoom, setVoiceChatRoom] = useState(null);

    let userToken = localStorage.getItem('auth');
    userToken = JSON.parse(userToken).access;
    console.log(userToken);

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

    const handleCreateRoom = () => {
        // Create a new room
        axios.post('http://localhost:8000/api/voice_chat/', { name: roomName }, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(response => {
                setRooms([...rooms, response.data]);
                toast.success('Room successfully created');
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to create room');
            });
    
        setRoomName('');
    };

    const handleDeleteRoom = (roomId) => {
        // Delete a room
        axios.delete(`http://localhost:8000/api/voice_chat/${roomId}/`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(() => {
                setRooms(rooms.filter(room => room.id !== roomId));
                toast.success('Room successfully deleted');
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

    // const joinVoiceChatRoom = async (roomId) => {
    //     try {
    //         const room = await daily.room(roomId).join();
    //         setVoiceChatRoom(room);
    //     } catch (error) {
    //         console.error('Failed to join voice chat room:', error);
    //     }
    // };

    const handleJoinRoom = (roomId) => {
        axios.post(`http://localhost:8000/api/voice_chat/${roomId}/join/`, {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
            .then(response => {
                setJoinedRoom(rooms.find(room => room.id === roomId));
                fetchRooms();
                toast.success('Joined room successfully');
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to join room');
            });
    };

    // const leaveVoiceChatRoom = async () => {
    //     if (voiceChatRoom) {
    //         try {
    //             await voiceChatRoom.leave();
    //             setVoiceChatRoom(null);
    //         } catch (error) {
    //             console.error('Failed to leave voice chat room:', error);
    //         }
    //     }
    // };

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
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to leave room');
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Toaster />
            <Container maxWidth="sm">
                <Typography variant="h3" style={{ paddingBottom: '20px' }}>
                    Voice Chat Rooms
                </Typography>
                <TextField
                    label="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCreateRoom}
                    fullWidth
                >
                    Create Room
                </Button>
                <List>
                    {rooms.map((room) => (
                        <ListItem key={room.id}>
                            <ListItemText 
                                primary={room.name}
                                secondary={
                                    <>
                                        {`Created by: ${room.creator}`}
                                        <br />
                                        {`Online users: ${room.online_users.length}`}
                                    </>
                                }
                                //secondary={`Created by: ${room.creator} Online users: ${room.online_users.length}`} 
                            />
                            {joinedRoom && joinedRoom.id === room.id ? (
                                <Button variant="contained" color="primary" onClick={() => handleLeaveRoom(room.id)}>Leave</Button>
                            ) : (
                                <Button variant="contained" color="secondary" onClick={() => handleJoinRoom(room.id)}>Join</Button>
                            )}
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoom(room.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                {joinedRoom && (
                    <>
                        <Typography variant="h6" style={{ paddingTop: '20px' }}>
                            Online users in {joinedRoom.name}:
                        </Typography>
                        <List>
                            {joinedRoom.online_users.map((user) => (
                                <ListItem key={user.id}>
                                    <ListItemText primary={user.username} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </Container>
        </ThemeProvider>
    );
}

export default VoiceChatApp;