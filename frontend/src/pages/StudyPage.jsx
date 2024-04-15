import React, { useState, useEffect } from 'react';
import {
    InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Card, CardContent, Grid, List, ListItem, ListItemText, Paper, IconButton, Chip
} from '@mui/material';
import { useParams, useNavigate, Link } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import axios from 'axios';
import useSWR from 'swr'
import { Question, Quiz } from './CreateQuiz.jsx';
import { getUser } from '../hooks/user.actions';

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

const quiz1 = new Quiz([new Question('What describes an inverse relationship between two variables?', ['y = -x', 'y = x', 'y = x^2', 'y = 1/x'], 3)], 'Physics Quiz2');
const quiz2 = new Quiz([new Question('How is force related to mass and acceleration?', ['F = M*A', 'F = M/A', 'F = M-A', 'F = A/M'], 0), new Question('What is the color of the sky?', ['Green', 'Blue', 'Purple', 'Yellow'], 1)], 'Physics Quiz1');


export default function StudyPage() {
    const {courseID, sectionID,  moduleID} = useParams();
    const [module, setModule] = useState({});
    const [quizList, setQuizList] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const user = getUser();

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/module/${moduleID}`, {
                headers: {
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                }
            }); // Replace with your actual API endpoint
            const quizzes = await response.data;
            console.log(quizzes)
            setModule(response.data);
            setQuizList(response.data.quizzes.map(quiz => new Quiz(
                quiz.id,
                quiz.questionList.map(question => {
                    const correctAnswer = question.answerList.findIndex(answer => answer.is_correct === true);
                    return new Question(question.text, question.answerList.map(answer => answer.text), correctAnswer);
                }),
                quiz.title,
                quiz.user_has_upvoted,
                quiz.ratings,
                quiz.endorsed
            )));
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };



    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleAnswerClick = (index) => {
        setSelectedAnswer(index);
    };

    const checkAnswer = () => {
        if (selectedAnswer == null) {
        alert('Please select an answer!');
        }
        else if (selectedAnswer === selectedQuiz.questionList[currentQuestionIndex].correctAnswer) {
        alert('Correct!');
        }
        else {
        alert('Incorrect!');
        }
    };

    const handleUpvote = async () => {
        try {
            console.log(quizList);
            console.log(selectedQuiz);
            if (selectedQuiz.user_has_upvoted) {
                const response = await axios.post(`http://localhost:8000/api/quiz/${selectedQuiz.id}/remove_upvote/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
    
                if (response.status === 200) {
                    setSelectedQuiz(prevQuiz => ({
                        ...prevQuiz,
                        ratings: prevQuiz.ratings - 1,
                        user_has_upvoted: false
                    }));
                }
            } else {
                const response = await axios.post(`http://localhost:8000/api/quiz/${selectedQuiz.id}/upvote/`, {}, {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                });
    
                if (response.status === 200) {
                    setSelectedQuiz(prevQuiz => ({
                        ...prevQuiz,
                        ratings: prevQuiz.ratings + 1,
                        user_has_upvoted: true
                    }));
                }
            }
            fetchQuizzes();
        } catch (error) {
            console.error('Failed to update upvote status:', error);
        }
    }

    const handleEndorse = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/quiz/${selectedQuiz.id}/endorse/`, {}, {
                headers: {
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                }
            });

            if (response.status === 200) {
                setSelectedQuiz(prevQuiz => ({
                    ...prevQuiz,
                    endorsed: true
                }));
            }
            fetchQuizzes();
        } catch (error) {
            console.error('Failed to endorse quiz:', error);
        }
    }

    const handleUnendorse = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/api/quiz/${selectedQuiz.id}/unendorse/`, {}, {
                headers: {
                    'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                }
            });

            if (response.status === 200) {
                setSelectedQuiz(prevQuiz => ({
                    ...prevQuiz,
                    endorsed: false
                }));
            }
            fetchQuizzes();
        }
        catch (error) {
            console.error('Failed to unendorse quiz:', error);
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <AppBar position="static" color="secondary">
            <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {module.name + ' Study Page'}
            </Typography>
            <Link to="/create-quiz" state={{ cid: `${courseID}`, sid: `${sectionID}`, mid:`${moduleID}`}}>
                <Button variant="contained">
                Create Quiz
                </Button>
            </Link>
            </Toolbar>
        </AppBar>
        <Box sx={{ m: 2 }}>
            <Grid container direction="row" sx={{ my: 4 }}>
            <Grid item xs={3}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Quiz List
                </Typography>
                {quizList.map((quiz, index) => (
                    <Typography
                    variant="body1"
                    color="primary"
                    key={index}
                    sx={{ my: 2, cursor: 'pointer', '&:hover': { color: 'blue' } }}
                    onClick={() => {
                        setSelectedQuiz(quiz);
                        setSelectedAnswer(null);
                        setCurrentQuestionIndex(0);
                    }}
                    >
                    {quiz.quizName}
                    </Typography>
                ))}
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {selectedQuiz ? `${selectedQuiz.quizName}` : 'No quiz selected'}
                </Typography>
                {(selectedQuiz != null) && (
                    <List>
                        {selectedQuiz.endorsed && <Chip label="Endorsed" color="secondary" />}
                    <ListItem>
                        <ListItemText primary={`Q${currentQuestionIndex + 1}: ${selectedQuiz.questionList[currentQuestionIndex].question}`} />
                        <Button size="small" variant="contained" onClick={checkAnswer}>
                        Check Answer
                        </Button>
                    </ListItem>
                    {selectedQuiz.questionList[currentQuestionIndex].answerList.map((answer, index) => (
                        <Button
                        variant="outlined"
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        sx={{ my: 1, backgroundColor: selectedAnswer === index ? 'lightgray' : 'white', textTransform: 'none' }}
                        >
                        {answer}
                        </Button>
                    ))}
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" disabled={currentQuestionIndex === 0} onClick={() => { setCurrentQuestionIndex(currentQuestionIndex - 1); setSelectedAnswer(null); }}>
                        Previous
                        </Button>
                        <Button variant="contained" disabled={currentQuestionIndex === selectedQuiz.questionList.length - 1} onClick={() => { setCurrentQuestionIndex(currentQuestionIndex + 1); setSelectedAnswer(null) }}>
                        Next
                        </Button>
                    </Box>
                    <IconButton 
                    color="primary" 
                    aria-label="like"
                    onClick={handleUpvote}
                    >
                    {selectedQuiz.user_has_upvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                    </IconButton>
                    <Typography variant="body2" component="span">
                        {selectedQuiz.ratings}
                    </Typography>
                    {user.is_instructor && !selectedQuiz.endorsed && (
                        <Box ml={2}>
                            <Button variant="contained" onClick={handleEndorse}>
                            Endorse
                            </Button>
                        </Box>
                    )}
                    {user.is_instructor && selectedQuiz.endorsed && (
                        <Box ml={2}>
                            <Button variant="contained" onClick={handleUnendorse}>
                            Unendorse
                            </Button>
                        </Box>
                    )}
                    </List>
                    
                )}
                </Paper>
            </Grid>
            </Grid>
        </Box>
        </ThemeProvider>
    );
}