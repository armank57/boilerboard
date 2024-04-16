import React, { useState, useEffect } from 'react';
import {
    InputLabel, FormControl, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Card, CardContent, Grid, List, ListItem, ListItemText, Paper
} from '@mui/material';
import { useParams, useNavigate, Link } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useSWR from 'swr'
import axios from 'axios'
import { Question, Quiz } from './CreateQuiz.jsx';

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
    const navigate = useNavigate();
    const {courseID, sectionID,  moduleID} = useParams();
    const [module, setModule] = useState({});
    const [quizList, setQuizList] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/module/${moduleID}`)
        .then(response => {
            setModule(response.data);
            setQuizList(response.data.quizzes.map(quiz => new Quiz(
                quiz.questionList.map(question => {
                    const correctAnswer = question.answerList.findIndex(answer => answer.is_correct === true);
                    return new Question(question.text, question.answerList.map(answer => answer.text), correctAnswer);
                }),
                quiz.title
                )));
        })
        .catch(error => {
            console.error('Error fetching subjects:', error);
        });
        axios.get(`http://127.0.0.1:8000/api/course/${courseID}/is_in_course/`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`
            }
        })
        .then(response => {
            //alert(response.data)
            if(!response.data){
                navigate(`/courses/${courseID}`)
            }
        })
        .catch(error => {
            console.error('Error fetching is_in_course:', error);
        });
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
                    </List>
                )}
                </Paper>
            </Grid>
            </Grid>
        </Box>
        </ThemeProvider>
    );
}