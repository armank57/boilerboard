import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';

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

const APP_ID = 'ea233ac2f20c40fb92905a6232d42fe4';
const CHANNEL_NAME = 'test';
const TEMP_TOKEN = '007eJxTYHCa7BG59weL7e90Ka3U2Z0ttXxuUUFBZSr3fhUe6DHQjVBgSE00MjZOTDZKMzJINjFIS7I0sjQwTTQzMjZKMTFKSzV5+5ghrSGQkSFXrJOBEQpBfBaGktTiEgYGALYsHWw=';
function VoiceApp1() {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/voice_chat/')
      .then((response) => setRooms(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!client) {
      const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(rtcClient);
    } else {
      const initLocalAudio = async () => {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);
        await client.join(APP_ID, CHANNEL_NAME, TEMP_TOKEN); // Add this line
        await client.publish([audioTrack]);
      };
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
      });
      initLocalAudio();
    }
    return () => {
      localAudioTrack && localAudioTrack.close();
      client && client.leave();
    };
  }, [client, localAudioTrack]);

  const handleCreateRoom = () => {
    axios
      .post(
        'http://localhost:8000/api/voice_chat/',
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        setRooms([...rooms, response.data]);
        toast.success('Room successfully created');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to create room');
      });

    setRoomName('');
  };

  let userToken = localStorage.getItem('auth');
  userToken = JSON.parse(userToken).access;
  console.log(userToken);

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
                secondary={`Created by: ${room.creator}`}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </ThemeProvider>
  );
}

export default VoiceApp1;
