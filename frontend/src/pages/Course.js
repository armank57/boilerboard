import React from 'react'
import { useParams } from "react-router-dom"
import JoinCourseButton from '../components/JoinCourseButton'
import useSWR from 'swr'
import axios from 'axios'
const fetcher = url => axios.get(url).then(res => res.data)
function Course() {
    const { courseID } = useParams()
    const { data, error } = useSWR(`http://127.0.0.1:8000/api/course/${courseID}`, fetcher)
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>
    return (
        <div>
            <p>{data.description}</p>
            <JoinCourseButton cid={data.id} />
        </div>
    )
}

export default Course;