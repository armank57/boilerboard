import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CourseButton( props ) {
    const [isInCourse, setIsInCourse] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/course/${props.cid}/is_in_course/`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`
            }
        })
        .then(response => {
            setIsInCourse(response.data);
        })
        .catch(error => {
            console.error('Error fetching is_in_course:', error);
        });
    }, [props.cid]);

    const handleButtonClick = () => {
        const endpoint = isInCourse ? `/api/course/${props.cid}/leave_course/` : `/api/course/${props.cid}/join_course/`
        const successMessage = isInCourse ? 'Successfully left the course!' : 'Successfully joined the course!'
        const errorMessage = isInCourse ? 'Failed to leave the course.' : 'Failed to join the course.'
        
        axios.post('http://127.0.0.1:8000' + endpoint, {}, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`,
            }
        })
        .then(response => {
                if (response.status === 200) {
                alert(successMessage);
                setIsInCourse(!isInCourse);
            } else {
                alert(errorMessage);
            }
        })
        .catch(error => {
            alert('An error occurred while trying to update the course.');
        });
    };

    return (
        <button onClick={handleButtonClick}>
            {isInCourse ? 'Leave Course' : 'Join Course'}
        </button>
    );
}

export default CourseButton;