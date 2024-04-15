import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../hooks/user.actions";

function ProtectedRoute({ children }) {
    var hours = 1
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
        localStorage.setItem('setupTime', now)
    } else {
        if(now - setupTime > hours*60*60*1000) { // hours*60*60*1000 later
            localStorage.clear()
            localStorage.setItem('setupTime', now)
        }
    }
    const item = localStorage.getItem('auth');
    if (!item) {
        <Navigate to="/login/" />;
    }
    const user = JSON.parse(item);
    return user ? <>{ children }</> : <Navigate to="/login/" />;
}

export default ProtectedRoute;