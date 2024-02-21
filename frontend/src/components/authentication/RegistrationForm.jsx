import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegistrationForm() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
    });
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const registrationForm = event.currentTarget;
    
        if(registrationForm.checkValidity() === false) {
            event.stopPropogation();
        }
        setValidated(true);
    
        const data = {
            username: form.username,
            password: form.password,
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name,
        };

        axios.post("http://localhost:8000/api/auth/register/", data).then((res) => {
            // Registering the Account and tokens in the store

            localStorage.setItem("auth", JSON.stringify({
                access: res.data.access,
                refresh: res.data.refresh,
                user: res.data.user
            }));
            navigate("/");
        }).catch((err) => {
            if(err.message) {
                setError(err.request.response);
            }
        });
        
    };

    return (
        <Form
            id="registration-form"
            className="border-p-4 rounded"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >
            <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value})}
                    required
                    type="text"
                    placeholder="Enter first name"
                />
                <Form.Control.Feedback type="invalid">
                    This field is required
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value})}
                    required
                    type="text"
                    placeholder="Enter last name"
                />
                <Form.Control.Feedback type="invalid">
                    This field is required
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value})}
                    required
                    type="text"
                    placeholder="Enter username"
                />
                <Form.Control.Feedback type="invalid">
                    This field is required
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value})}
                    required
                    type="email"
                    placeholder="Enter a Purdue email address"
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid Purdue Email
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Create Password</Form.Label>
                <Form.Control 
                    value={form.password}
                    minLength="8"
                    onChange={(e) => setForm({ ...form, password: e.target.value})}
                    required
                    type="password"
                    placeholder="Enter Password"
                />
                <Form.Control.Feedback type="invalid">
                    This field is required
                </Form.Control.Feedback>

            </Form.Group>

            <div className="text-content text-danger">
                {error && <p>{error}</p>}
            </div>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default RegistrationForm;

