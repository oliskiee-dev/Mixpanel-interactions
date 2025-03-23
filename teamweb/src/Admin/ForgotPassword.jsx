import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router";
import './ForgotPassword.css';
import TeamLogo from "../assets/images/TeamLogo.jpg";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter your email or username");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      // Check if response is empty
      const text = await response.text();
      
      // If we got a non-empty response, try to parse it as JSON
      let data;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Error parsing JSON:", e);
          throw new Error("Invalid server response");
        }
      } else {
        throw new Error("Empty response from server");
      }
      
      if (!response.ok) {
        throw new Error(data?.error || "Failed to verify user");
      }
      
      // If verification succeeds, navigate to reset password page
      navigate('/reset-password', { 
        state: { 
          resetToken: data.resetToken, 
          userId: data.userId 
        } 
      });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <img src={TeamLogo} alt="Team Logo" className="team-logo" />
      <div className="container">
        <div className="form-box">
          <div className="form-content">
            <FaUser className="admin-icon" />
            <div className="title">FORGOT PASSWORD?</div>
            <p className="description">
              Please enter your registered email or username to reset your password.
            </p>
            {error && <p className="error-message">{error}</p>}
            <br />
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Email or Username" 
                className="input-field" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? "PROCESSING..." : "SUBMIT"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;