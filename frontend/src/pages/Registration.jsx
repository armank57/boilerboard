import React from "react";
import { Link } from "react-router-dom";
// import RegistrationForm from "../components/authentication/RegistrationForm";
import RegistrationForm2 from "../components/authentication/RegistrationForm2"
// import BoilerBoardLogo from "../images/BoilerBoardLogo.png";
import "../styling/Registration.css";

function Registration() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 d-flex align-items-center">
                    <div className="content text-center px-4">
                        <h1 style={{color: "white"}}> Welcome to BoilerBoard!</h1>
                        <p style={{color: "white"}}>
                            Start by registering your account. <br/>
                            Or if you already have an account, please {""} 
                            <Link to="/login/">login</Link>
                        </p>
                    </div>
                </div>
                <div className="col-md-6 p-12">
                    <RegistrationForm2 />
                </div>
            </div>
        </div>
    );
}

export default Registration