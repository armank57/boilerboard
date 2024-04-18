import { useParams, Navigate, Link } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

function InCourse({children}) {
    const { courseID } = useParams()
    const [isInCourse, setIsInCourse] = useState(false);

    useEffect(() => {
        
        axios.get(`http://127.0.0.1:8000/api/course/${courseID}/is_in_course/`, {
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
    }, []);

    alert('InCourse.jsx courseID:', courseID);
return isInCourse ? <>{ children }</> : <Navigate to={`/courses/${courseID}`} />;
}

export default InCourse;