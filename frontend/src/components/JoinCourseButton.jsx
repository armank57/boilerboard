
import React, {  useEffect } from 'react';
import axios from 'axios';

function CourseButton( {setCourse, cid, inCourse} ) {


    const handleButtonClick = () => {
        const endpoint = inCourse ? `/api/course/${cid}/leave_course/` : `/api/course/${cid}/join_course/`
        const successMessage = inCourse ? 'Successfully left the course!' : 'Successfully joined the course!'
        const errorMessage = inCourse ? 'Failed to leave the course.' : 'Failed to join the course.'
        
        axios.post('http://127.0.0.1:8000' + endpoint, {}, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth')).access}`,
            }
        })
        .then(response => {
                if (response.status === 200) {
                alert(successMessage);
                setCourse(!inCourse);
            } else {
                alert(errorMessage);
            }
        })
        .catch(error => {
            alert('An error occurred while trying to update the course.');
            console.log(error)
        });
    };

    return (
        <button onClick={handleButtonClick}>
            {inCourse ? 'Leave Course' : 'Join Course'}
        </button>
    );
}

export default CourseButton;
