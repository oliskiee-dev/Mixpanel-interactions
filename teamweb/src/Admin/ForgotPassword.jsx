import React from "react";
import { FaUser } from "react-icons/fa";
import './ForgotPassword.css';
import TeamLogo from "../assets/images/TeamLogo.jpg";

  function ForgotPassword() {
    return (
      <>
      <img src={TeamLogo} alt="Team Logo" className="team-logo" /> {/* Logo at the top left */}
      <div className="container">
        <div className="form-box">
          <div className="form-content">
            <FaUser className="admin-icon" />
            <div className="title">FORGOT PASSWORD?</div>
            <p className="description">
              Please enter your registered email or username, if you want to reset your password.
            </p>
            <br />
            <input type="text" placeholder="Email or Username" className="input-field" />
            <button className="btn">SUBMIT</button>
          </div>
        </div>
      </div>
      </>
    );
  }

export default ForgotPassword;