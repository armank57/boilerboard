import React, { useState, useEffect } from 'react';
import {
    InputLabel, AppBar, Toolbar, Button, TextField, Select, MenuItem, Typography,
    Box, Grid, InputAdornment, Paper
} from '@mui/material';

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import { Link } from 'react-router-dom';
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

function Question(question, answerList, correctAnswer) {
    this.question = question;
    this.answerList = answerList;
    this.correctAnswer = correctAnswer;
}

function Quiz(questionList, quizName) {
    this.questionList = questionList;
    this.quizName = quizName;
}


function CreateQuiz() {
    const [questionNum, setQuestionNum] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [quizName, setQuizName] = useState('');

    const validateFields = () => {
        for (let question of questions) {
            if (!question.question.trim()) {
                return false;
            }
            for (let answer of question.answerList) {
                if (!answer.trim()) {
                    return false;
                }
            }
            if (question.correctAnswer === undefined || question.correctAnswer === null || question.correctAnswer === '') {
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        if (questions.length < questionNum) {
            setQuestions(questions.concat(Array.from({ length: questionNum - questions.length }, () => new Question('', ['', '', '', ''], ''))));
        }
        else if (questions.length > questionNum) {
            setQuestions(questions.slice(0, questionNum));
        }
    }, [questionNum]);

    const changeQuestionNum = (event) => {
        if (event.target.value > 50 || event.target.value < 0) {
            return;
        }
        setQuestionNum(event.target.value);
    };

    const changeQuizName = (event) => {
        setQuizName(event.target.value);
    };

    const handleQuestionChange = (index) => (event) => {
        const newQuestions = [...questions];
        newQuestions[index].question = event.target.value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex) => (event) => {
        const newQuestions = [...questions];
        const newAnswerList = [...newQuestions[questionIndex].answerList];
        newAnswerList[answerIndex] = event.target.value;
        newQuestions[questionIndex].answerList = newAnswerList;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex) => (event) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correctAnswer = event.target.value;
        setQuestions(newQuestions);
    };

    const handleClick = async () => {
        for (let i = 0; i < questions.length; i++) {
            console.log(questions[i].question);
            console.log(questions[i].answerList);
            console.log(questions[i].correctAnswer);
        }
        if (!validateFields()) {
            alert('Please fill in all fields.');
            return;
        }
    
        // Create the data object for the POST request
        const data = {
            "author": "userid", //replace with user id
            "title": quizName,
            "questionList": questions.map(q => ({
                "text": q.question,
                "answerList": q.answerList.map((a, i) => ({
                    "text": a,
                    "is_correct": i === q.correctAnswer
                }))
            }))
        };

        let userToken = localStorage.getItem('auth');
        userToken = JSON.parse(userToken).access;
        console.log(userToken)
    
        // Send the POST request
        try {
            const response = await fetch('http://127.0.0.1:8000/api/quiz/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quiz = await response.json();
            console.log(quiz);
            alert('Quiz created successfully!');
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Error creating quiz:', error);
        }
    };

    
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h4" sx={{ flexGrow: 1 }}>
                        Physics 101 Quiz Creator
                    </Typography>
                    <Link to="/study-page">
                        <Button variant="contained" color="primary">
                            Back to Study Page
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box sx={{ m: 2 }}>
                <Grid container direction="row" sx={{ my: 4 }}>
                <Grid item sx={{ m: 2 }}>
                        <Typography variant="h6">
                            Quiz Name
                        </Typography>
                    </Grid>
                    <Grid item sx={{ m: 2 }}>
                        <TextField
                            type="text"
                            value={quizName}
                            onChange={changeQuizName}
                            variant="outlined"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    <Grid item sx={{ m: 2 }}>
                        <Typography variant="h6">
                            Number of Questions
                        </Typography>
                    </Grid>
                    <Grid item sx={{ m: 2 }}>
                        <TextField
                            type="number"
                            value={questionNum}
                            onChange={changeQuestionNum}
                            variant="outlined"
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    <Grid item sx={{ m: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleClick}>
                            Submit Quiz
                        </Button>
                    </Grid>
                </Grid>
                <Grid container direction="row" sx={{ display: 'flex', justifyContent: 'center' }}>
                    {questions.map((question, questionIndex) => (
                        <Grid item sx={{ m: 1 }} key={`question-${questionIndex}`}>
                            <Paper variant="outlined" sx={{ p: 2, mb: 2, border: '2px solid', maxWidth: '42vw' }}>
                                <Grid container direction="row" sx={{ my: 2, display: 'flex', justifyContent: 'center' }} spacing={2}>
                                    <Grid item xs={8}>
                                        <InputLabel htmlFor={`question-${questionIndex}`}>Question {questionIndex + 1}</InputLabel>
                                        <TextField
                                            type="text"
                                            value={question.question}
                                            onChange={handleQuestionChange(questionIndex)}
                                            variant="outlined"
                                            placeholder={`Question ${questionIndex + 1}`}
                                            helperText="Enter your question here"
                                            color="secondary"
                                            sx={{ my: 1 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <QuestionAnswerIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <InputLabel htmlFor={`correct-answer-${questionIndex}`}>Correct Answer</InputLabel>
                                        <Select
                                            id={`correct-answer-${questionIndex}`}
                                            value={question.correctAnswer}
                                            color="secondary"
                                            onChange={handleCorrectAnswerChange(questionIndex)}
                                            sx={{ mt: 2 }}
                                            fullWidth
                                        >
                                            {question.answerList.map((value, answerIndex) => (
                                                <MenuItem key={answerIndex} value={answerIndex}>
                                                    {`${value}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" spacing={2}>
                                    {question.answerList.map((value, answerIndex) => (
                                        <Grid item xs={6} key={`answer-${answerIndex}`}>
                                            <InputLabel htmlFor={`answer-${questionIndex}-${answerIndex}`}>Option {answerIndex + 1}</InputLabel>
                                            <TextField
                                                color="secondary"
                                                id={`answer-${questionIndex}-${answerIndex}`}
                                                type="text"
                                                value={value}
                                                onChange={handleAnswerChange(questionIndex, answerIndex)}
                                                variant="outlined"
                                                sx={{ my: 0 }}
                                                fullWidth
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default CreateQuiz
export { Question, Quiz }