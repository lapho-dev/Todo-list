import React, { useState } from "react";

interface LoginProps {
    onLoginSuccess: (userId: number) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { username, password };
            const response = await fetch("http://localhost:6001/login", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const userData = await response.json();
            if (response.ok) {
                onLoginSuccess(userData.rows[0].user_id);
            } else {
                console.error(userData);
            }
        } catch (err) {
            console.error(err.message);
        }
    };
    
    return (
        <div>
            <h1 className="text-center my-5">Login</h1>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input
                type="username"
                name="username"
                placeholder="username"
                className="form-control my-3"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                /> 
                <input
                type="password"
                name="password"
                placeholder="password"
                className="form-control my-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-success btn-block">Login</button>
            </form>

            <a href="signup" className="button">Sign Up</a>

        </div>
    );
};

export default Login;


