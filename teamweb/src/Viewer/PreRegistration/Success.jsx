import React from 'react';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import './Pre-registration.css';

function Success() {
    return (
        <>
            <Header />
            <div className="pre-reg-success-wrapper">
                <div className="pre-reg-success-card">
                    <div className="pre-reg-success-checkmark">✓</div>
                    <h1 className="pre-reg-success-heading">Pre-Registration Successful!</h1>
                    <div className="pre-reg-success-details">
                        <p>Thank you for pre-registering with us.</p>
                        <div className="pre-reg-success-info">
                            <p>What happens next?</p>
                            <ul>
                                <li>You will receive a confirmation email shortly</li>
                                <li>Our admissions team will review your application</li>
                                <li>We will contact you within 2-3 business days</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pre-reg-success-buttons">
                        <a href="/" className="pre-reg-success-home-btn">
                            Return to Homepage
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Success;