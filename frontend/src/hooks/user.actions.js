import axios from "axios";
import { useNavigate } from "react-router-dom";

function useUserActions() {
    const navigate = useNavigate();
    const baseURL = "http://localhost:8000/api";

    return {
        login,
        register,
        logout,
    };

    //Login the User
    function login (data) {
        return axios.post(`${baseURL}/auth/login/`, data).then((res) => {
            setUserData(res.data);
            navigate("/");
        });
    }

    // Logout the User
    function logout () {
        localStorage.removeItem("auth");
        navigate("/login/");
    }

    // Register the user
    function register(data) {
        return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
            // Registering the account and tokens in the store
            setUserData(res.data);
            navigate("/");
        });
    } 
}

// Get the User
function getUser() {
    const auth = JSON.parse(localStorage.getItem("auth")) || null;
    if (auth) {
        return auth.user;
    } else {
        console.log("auth is null");
        return null;
    }
}

// Get Access Token
function getAccessToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth.access;
}

// Get Refresh Token
function getRefreshToken() {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth.refresh;
}

// Set the access, token and user property
function setUserData(data) {
    localStorage.setItem("auth", JSON.stringify({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
    }));
}

export { useUserActions, getUser, getAccessToken, getRefreshToken };


