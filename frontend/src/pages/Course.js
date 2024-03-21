import React, { useEffect } from 'react'
import { Box, Button, Card, CardContent, Container, TextField, Typography } from '@mui/material';
import { useParams, useNavigate, Link } from "react-router-dom"
import CourseButton from '../components/JoinCourseButton'
import NewModule from '../components/NewModule'
import useSWR from 'swr'
import axios from 'axios'
const fetcher = url => axios.get(url).then(res => res.data)
function Course() {
    const navigate = useNavigate()
    const { courseID } = useParams()
    const { data, error } = useSWR(`http://127.0.0.1:8000/api/course/${courseID}`, fetcher)

    const newSectionHandler = () => {
        console.log('New Section');
        const secName = prompt('Please enter the name of the new section')

        console.log('Course ID:', courseID)
        console.log('Section Name:', secName);

        try {
            const response = axios.post('http://127.0.0.1:8000/api/section/', {
                name: secName,
                course: courseID,
            }, {
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500                
                }
            });

            if (response.status === 201) {
                console.log(`Section created: ${response.data}`);
            } else if (response.status === 400) { 
                console.error(`Section not created: ${response.data.detail}`);
            }
        } catch (error) {
            // Network error or any other error with status code 500 or above
            alert('Error:', error);
            console.log(error);
        }

        //alert(`You entered: ${secName}`)
    }

    const newModuleHandler = (sectionID) => {
        console.log('New Module');
        navigate(`/courses/${courseID}/${sectionID}/new-module`);
    }

    function ModuleMapper(section) {
        return section.modules.map((module, index) => (
            <Link to={`/courses/${courseID}/${section.id}/${module.id}/`}>
                <Card key={index} style={{ 
                    backgroundColor: '#d3d3d3', 
                    marginBottom: '20px',
                    height: '100px',
                    overflow: 'hidden',
                }}>
                    <CardContent>
                        <Typography variant="h5">
                            {module.name}
                        </Typography>
                        
                    </CardContent>
                </Card>
            </Link>
        ));
    }

    function SectionMapper() {
        return data.sections.map((section, index) => (
            <Card key={index} style={{ 
                backgroundColor: '#d3d3d3', 
                marginBottom: '20px',
                height: '300px',
                overflow: 'hidden',
            }}>
                <CardContent>
                    <Typography variant="h5">
                        {section.name}
                    </Typography>
                    <div>
                        {ModuleMapper(section)}
                    </div>
                    <Button
                        name="createModule"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => newModuleHandler(section.id)}
                    >
                        New Module
                    </Button>
                </CardContent>
            </Card>
        ));
    }

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>
    return (
        <div>
            <p>{data.description}</p>
            <CourseButton cid={data.id} />
            <Button
                name="addSection"
                variant="contained"
                color="secondary"
                fullWidth
                onClick={newSectionHandler}
            >
                New Section
            </Button>
            <div>
                {SectionMapper()}
            </div>
        </div>
    )
}

export default Course;