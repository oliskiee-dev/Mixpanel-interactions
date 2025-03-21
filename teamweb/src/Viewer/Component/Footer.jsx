import "./Footer.css";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Row: Branding & Links */}
        <div className="footer-top">
          {/* Left: Branding */}
          <div className="footer-brand">
            <h2>Teamian<span>Web</span></h2>
            <p className="tagline">YES WE CAN!</p>
            <div className="footer-contact-info">
              <p><FaMapMarkerAlt /> 226 Lambakin, Marilao Bulacan</p>
              <p><FaEnvelope /> tmcs1983@gmail.com</p>
              <p><FaPhone /> 0956-099-3796</p>
              <p><FaFacebookF /> Team Mission Christian School, Inc</p>
            </div>
          </div>

          {/* Right: Links */}
          <div className="footer-links-container">
            <div className="footer-links-column">
              <h3>About Us</h3>
              <div className="footer-links">
                <a href="#">Mission</a>
                <a href="#">Vision</a>
                <a href="#">Core Values</a>
              </div>
            </div>
            
            <div className="footer-links-column">
              <h3>School Programs</h3>
              <div className="footer-links">
                <a href="#">School Clinic</a>
                <a href="#">Academic Programs</a>
                <a href="#">School Calendar</a>
              </div>
            </div>
            
            <div className="footer-links-column">
              <h3>Policies</h3>
              <div className="footer-links">
                <a href="#">Accessibility Statement</a>
                <a href="#">Non-Discrimination Policy</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Code of Conduct</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="footer-bottom">
          <hr className="footer-divider" />
          <p>Copyright © 2024 The Exceptionals. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;