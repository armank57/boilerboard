import React from 'react';
import axios from 'axios';

function JoinCourseButton( props ) {
    const joinCourse = () => {
        axios.post(`/api/course/${props.cid}/join_course`)
            .then(response => {
                if (response.status === 200) {
                    alert('Successfully joined the course!');
                } else {
                    alert('Failed to join the course.');
                }
            })
            .catch(error => {
                alert('An error occurred while trying to join the course.');
            });
    };

    return (
        <button onClick={joinCourse}>
            Join Course
        </button>
    );
}

export default JoinCourseButton;