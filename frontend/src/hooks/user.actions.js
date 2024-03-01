import axios from "axios";
import { useNavigate } from "react-router-dom";

function useUserActions() {
    const navigate = useNavigate();
    const baseURL = "http://localhost:8000/api";

    return {
        login,
        register,
        logout,
        sendResetPasswordEmail,
        resetPassword,
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

    function sendResetPasswordEmail(data) {
        axios.post(`${baseURL}/auth/send-user-email/`, data).then((res) => {
            navigate("/reset-password-dialogue/")
        }).catch((err) => {
            if (err.message) {
                console.log(err.message)
            }
            navigate("/reset-password-dialogue/")
        })
    }

    function resetPassword(data, public_id, token) {
        axios.post(`${baseURL}/auth/reset-password/${public_id}/${token}`, data).then((res) => {
            setUserData(res.data);
            navigate("/");
        }).catch((err) => {
            if(err.message) {
                console.log(err.message);
                if(err.message === "Request failed with status code 400") {
                    alert("Your reset session has expired, please try again");
                    navigate("/reset-password/");
                }
            }
        })
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


