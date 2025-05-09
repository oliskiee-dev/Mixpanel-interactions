// src/Admin/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FaUser, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import TeamLogo from "../assets/images/TeamLogo.png";
import Analytics from "../utils/analytics";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const togglePasswordVisibility = () => {
        // Track password visibility toggle
        Analytics.trackClick(
            showPassword ? 'hide_password' : 'show_password',
            'authentication'
        );
        setShowPassword(!showPassword);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Track login attempt
        Analytics.track('Login Attempted', {
            has_username: !!formData.username,
            has_password: !!formData.password
        });
        
        try {
            const response = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (response.status === 200 && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", formData.username);
                
                // Track successful login
                Analytics.identify(formData.username);
                Analytics.track('Login Successful', {
                    username: formData.username
                });
                Analytics.setUserProfile({
                    $name: formData.username,
                    $last_login: new Date().toISOString()
                });
                
                navigate("/admin-homepage");
            } else {
                setError(`Error: ${data.error || "Login failed"}`);
                
                // Track failed login
                Analytics.track('Login Failed', {
                    reason: data.error || "Unknown error",
                    username: formData.username
                });
            }
        } catch (error) {
            setError("Error: An error occurred. Please try again.");
            
            // Track error
            Analytics.track('Login Error', {
                error_message: error.message
            });
        }
    };

    return (
        <div className="page-container">
            <img src={TeamLogo} alt="Team Logo" className="team-logo" />
            <div className="login-container">
                <div className="form-box">
                    <div className="form-content">
                        <FaUser className="admin-icon" />
                        <div className="title">HI ADMIN!</div>
                        {error && (
                            <div className="error-box">
                                <FaExclamationCircle className="error-icon" />
                                <span>{error}</span>
                            </div>
                        )}
                        <form 
                            onSubmit={handleSubmit}
                            data-mp-form="login-form"
                        >
                            <input
                                type="text"
                                name="username"
                                placeholder="USERNAME"
                                className="input-field"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                data-mp-field="username"
                            />
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="PASSWORD"
                                    className="input-field"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    data-mp-field="password"
                                />
                                <span 
                                    className="password-toggle-icon" 
                                    onClick={togglePasswordVisibility}
                                    data-mp-event="Toggle Password Visibility"
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                            <button 
                                type="submit" 
                                className="btn"
                                data-mp-event="Login Submit"
                            >
                                LOGIN
                            </button>
                        </form>
                        <a 
                            href="/forgot-password" 
                            className="forgot-password"
                            data-mp-event="Forgot Password"
                        >
                            Forgot Password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;