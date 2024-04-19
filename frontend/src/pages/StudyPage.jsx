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
import LinearProgress from '@mui/material/LinearProgress';

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
    const { courseID, sectionID, moduleID } = useParams();
    const [module, setModule] = useState({});
    const [quizList, setQuizList] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [page, setPage] = useState('quizzes');
    const [isZoomed, setIsZoomed] = useState([]);
    const [quizHistory, setQuizHistory] = useState(null);
    const user = getUser();

    useEffect(() => {
        if (module && module.notes) {
            setIsZoomed(module.notes.map(() => false));
        }
    }, [module]);

    const handleImageClick = (index) => {
        const newIsZoomed = [...isZoomed];
        newIsZoomed[index] = !newIsZoomed[index];
        setIsZoomed(newIsZoomed);
    };

    const handleViewQuizzes = () => {
        setPage('quizzes');
    };

    const handleViewNotes = () => {
        setPage('notes');
    };

    const fetchQuizzes = async () => {
        try {
            axios.get(`http://127.0.0.1:8000/api/course/${courseID}/is_in_course/`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`
                }
            })
                .then(response => {
                    //alert(response.data)
                    if (!response.data) {
                        navigate(`/courses/${courseID}`)
                    }
                })
                .catch(error => {
                    console.error('Error fetching is_in_course:', error);
                });
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
        axios.get(`http://127.0.0.1:8000/api/course/${courseID}/is_in_course/`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`
            }
        })
            .then(response => {
                //alert(response.data)
                if (!response.data) {
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

    const checkAnswer = async () => {
        if (selectedAnswer == null) {
            alert('Please select an answer!');
        }
        else if (selectedAnswer === selectedQuiz.questionList[currentQuestionIndex].correctAnswer) {
            alert('Correct!');
            try {
                const response = await axios.post(
                    `http://127.0.0.1:8000/api/user/${user.id}/update_quiz_history/`,
                    {
                        "quiz_id": selectedQuiz.id,
                        "correct_answers": quizHistory.correct_answers + 1,
                        "total_questions": quizHistory.total_questions + 1
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                        }
                    }
                );
                fetchQuizHistory(selectedQuiz.id);
            } catch (error) {
                console.error('Error fetching quiz history:', error);
            }
        }
        else {
            alert('Incorrect!');
            try {
                const response = await axios.post(
                    `http://127.0.0.1:8000/api/user/${user.id}/update_quiz_history/`,
                    {
                        "quiz_id": selectedQuiz.id,
                        "correct_answers": quizHistory.correct_answers,
                        "total_questions": quizHistory.total_questions + 1
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                        }
                    }
                );
                fetchQuizHistory(selectedQuiz.id);
            } catch (error) {
                console.error('Error fetching quiz history:', error);
            }
        }
    };

    const fetchQuizHistory = async (quizID) => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/user/${user.id}/get_quiz_history/`,
                {
                    "quiz_id": quizID
                },
                {
                    headers: {
                        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('auth'))).access}`
                    }
                }
            );
            console.log(response.data.quiz_history);
            setQuizHistory(response.data.quiz_history);
        } catch (error) {
            console.error('Error fetching quiz history:', error);
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
        <AppBar position="static" color="primary">
            <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {module.name + ' Study Page'}
            </Typography>
            <Link to="/create-quiz" state={{ cid: `${courseID}`, sid: `${sectionID}`, mid: `${moduleID}` }}>
                        <Button variant="contained">
                            Create Quiz
                        </Button>
                    </Link>
                    <Link to="/create-note" state={{ cid: `${courseID}`, sid: `${sectionID}`, mid: `${moduleID}` }}>
                        <Button variant="contained" sx={{ marginLeft: 2 }}>
                            Create note
                        </Button>
                    </Link>
                    <Button variant="contained" sx={{ marginLeft: 2 }} onClick={handleViewQuizzes}>View Quizzes</Button>
                    <Button variant="contained" sx={{ marginLeft: 2 }} onClick={handleViewNotes}>View Notes</Button>
            </Toolbar>
        </AppBar>
            {page === 'quizzes' ? (
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
                                            fetchQuizHistory(quiz.id);
                                        }}
                                    >
                                        {quiz.quizName}
                                    </Typography>
                                ))}
                            </Paper>
                        </Grid>
                        <Grid item xs={9}>
                            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {selectedQuiz ? `${selectedQuiz.quizName}` : 'No quiz selected'}
                                    </Typography>
                                    {quizHistory && (
                                        <Box sx={{ ml: 2, width: "40%" }}>
                                            <Typography variant="h6">
                                                {quizHistory.correct_answers}/{quizHistory.total_questions} | {Math.round(quizHistory.score * 100 * 100) / 100}%                                          </Typography>
                                            <Box sx={{ width: '100%', mt: 1 }}>
                                                <LinearProgress variant="determinate" value={quizHistory.score * 100} />
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
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
            ) : (
                <Box sx={{ m: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }} color={"white"}>
                        Notes
                    </Typography>
                    {module.notes.map((note, index) => (
                        <Card key={index} sx={{ marginBottom: 3, overflow: 'visible' }}>
                            {note.image && (
                                <Box display="flex" justifyContent="center" sx={{ border: 'none', boxShadow: 'none' }}>
                                    <img
                                        src={note.image}
                                        alt="Note"
                                        style={{
                                            width: isZoomed[index] ? '60%' : '10%',
                                            height: 'auto',
                                            objectFit: 'contain',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleImageClick(index)}
                                    />
                                </Box>
                            )}
                            <CardContent sx={{ height: 'auto', border: 'none', boxShadow: 'none' }}>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        {note.content !== "" && (
                                            <Typography variant="body1" component="p" sx={{ marginTop: 1 }}>
                                                {note.content.split('\n').map((line, index) => (
                                                    <React.Fragment key={index}>
                                                        {line}
                                                        <br />
                                                    </React.Fragment>
                                                ))}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="caption" color="textSecondary">
                                            Author: {note.author_name} | Created: {new Date(note.created).toLocaleString()} | Last Updated: {new Date(note.updated).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </ThemeProvider>
    );
}