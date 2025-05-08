import React, { useState } from "react";
import { useNavigate } from "react-router"; // For navigation
import { FaUser, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa"; // Added eye icons
import "./Login.css";
import TeamLogo from "../assets/images/TeamLogo.png";
import Analytics from '../utils/analytics';

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(""); 
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        Analytics.track('Login Attempted', {
            timestamp: new Date().toISOString()
          });
        setError(""); 
        console.log(formData); // Debugging
        try {
            const response = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (response.status === 200 && data.token) {
                Analytics.identify(formData.username);
                Analytics.track('Login Successful', { 
                  username: formData.username,
                  timestamp: new Date().toISOString()
                });
                localStorage.setItem("token", data.token); // Save token
                localStorage.setItem("username", formData.username); // Save username
                
                // Track successful login
                Analytics.identify(formData.username);
                Analytics.track('Login', { 
                    success: true,
                    method: 'credentials'
                });
                Analytics.setUserProfile({
                    $username: formData.username,
                    last_login: new Date().toISOString()
                });
                Analytics.increment('login_count');
                
                navigate("/admin-homepage"); // Navigate to the admin homepage
            } else {
                Analytics.track('Login Failed', {
                    reason: data.error || "Unknown error",
                    timestamp: new Date().toISOString()
                  });
                setError(`Error: ${data.error || "Login failed"}`);
            }
        } catch (error) {
             // Track error
    Analytics.track('Login Error', {
        error_message: error.message,
        timestamp: new Date().toISOString()
      });

            setError("Error: An error occurred. Please try again.");
        }

        if (response.status === 200 && data.token) {
            Analytics.identify(formData.username);
            Analytics.track('Login Successful', {
              method: 'email_password'
            });
          }

    };
    
    return (
        <div className="page-container">
            <img src={TeamLogo} alt="Team Logo" className="team-logo" /> {/* Logo at the top left */}
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
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="username"
                                placeholder="USERNAME"
                                className="input-field"
                                value={formData.username}
                                onChange={handleChange}
                                required
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
                                />
                                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                            <button type="submit" className="btn">LOGIN</button>
                        </form>
                        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;