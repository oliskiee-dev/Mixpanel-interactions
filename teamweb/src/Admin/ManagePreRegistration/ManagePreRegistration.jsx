import React, { useState, useEffect } from "react";
import AdminHeader from '../Component/AdminHeader.jsx'
import './ManagePreRegistration.css';
import UpdateAppointment from './UpdateAppointment';
import UpdatePreRegistration from './UpdatePreRegistration';

function ManagePreRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        email: "",
        mobileNumber: "",
        isNewStudent: "",
        parentFirstName: "",
        parentLastName: "",
        parentMobileNumber: "",
        yearLevel: "",
        strand: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('table');

    useEffect(() => {
        // Check for existing form data when component mounts
        const storedData = sessionStorage.getItem('preRegFormData');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            sessionStorage.setItem('preRegFormData', JSON.stringify(formData));
            window.location.href = '/confirmregistration';
        }
    };

    const validateForm = (data) => {
        let errors = {};

        if (!data.firstName?.trim()) {
            errors.firstName = "First Name is required";
        }
        if (!data.lastName?.trim()) {
            errors.lastName = "Last Name is required";
        }
        if (!data.dateOfBirth?.trim()) {
            errors.dateOfBirth = "Date of Birth is required";
        }
        if (!data.gender?.trim()) {
            errors.gender = "Gender is required";
        }
        if (!data.nationality?.trim()) {
            errors.nationality = "Nationality is required";
        }
        if (!data.email?.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = "Email is invalid";
        }
        if (!data.mobileNumber?.trim()) {
            errors.mobileNumber = "Mobile Number is required";
        }
        if (!data.isNewStudent) {
            errors.isNewStudent = "Please select if you are a new or old student";
        }
        if (!data.parentFirstName?.trim()) {
            errors.parentFirstName = "Parent's First Name is required";
        }
        if (!data.parentLastName?.trim()) {
            errors.parentLastName = "Parent's Last Name is required";
        }
        if (!data.parentMobileNumber?.trim()) {
            errors.parentMobileNumber = "Parent's Mobile Number is required";
        }
        if (!data.yearLevel) {
            errors.yearLevel = "Grade Level is required";
        }
        if ((data.yearLevel === '11' || data.yearLevel === '12') && !data.strand) {
            errors.strand = "Strand is required for Senior High School students";
        }

        return errors;
    };

    useEffect(() => {
        const totalFields = 12; // Base number of required fields excluding strand
        let filledFields = Object.entries(formData).filter(([key, value]) => {
            // Don't count strand field for grades below 11
            if (key === 'strand' && !['11', '12'].includes(formData.yearLevel)) {
                return false;
            }
            return value !== "";
        }).length;

        // If grade 11 or 12 is selected, include strand in total required fields
        const adjustedTotalFields = ['11', '12'].includes(formData.yearLevel) ? totalFields + 1 : totalFields;

        const calculatedProgress = (filledFields / adjustedTotalFields) * 100;
        setProgress(Math.min(calculatedProgress, 100)); // Ensure progress doesn't exceed 100%
    }, [formData]);

    const studentData = [
        {
            name: "Juan Dela Cruz",
            gender: "Male",
            type: "NEW",
            dob: "February 11, 2003",
            grade: "Grade 11",
            strand: "STEM",
            email: "juandlcrz@gmail.com",
            contact: "+639494001323",
            appointment: "May 15, 2024, 7:00 AM-11:00 AM",
            status: "Approved"
        },
        {
            name: "Maria Santos",
            gender: "Female",
            type: "NEW",
            dob: "March 25, 2004",
            grade: "Grade 12",
            strand: "ABM",
            email: "maria.santos@email.com",
            contact: "+639123456789",
            appointment: "May 16, 2024, 9:00 AM-12:00 PM",
            status: "Not Approved"
        },
        {
            name: "Pedro Gonzales",
            gender: "Male",
            type: "NEW",
            dob: "July 10, 2005",
            grade: "Grade 11",
            strand: "HUMSS",
            email: "pedro.gonzales@email.com",
            contact: "+639987654321",
            appointment: "May 17, 2024, 8:00 AM-11:00 AM",
            status: "Approved"
        },
        {
            name: "Ana Reyes",
            gender: "Female",
            type: "NEW",
            dob: "December 5, 2003",
            grade: "Grade 12",
            strand: "STEM",
            email: "ana.reyes@email.com",
            contact: "+639876543210",
            appointment: "May 18, 2024, 10:00 AM-1:00 PM",
            status: "Approved"
        },
        {
            name: "Carlos Lim",
            gender: "Male",
            type: "NEW",
            dob: "January 20, 2004",
            grade: "Grade 11",
            strand: "TVL",
            email: "carlos.lim@email.com",
            contact: "+639765432109",
            appointment: "May 19, 2024, 7:30 AM-10:30 AM",
            status: "Not Approved"
        },
        {
            name: "Sofia Dela Rosa",
            gender: "Female",
            type: "NEW",
            dob: "June 30, 2005",
            grade: "Grade 11",
            strand: "ABM",
            email: "sofia.delarosa@email.com",
            contact: "+639654321098",
            appointment: "May 20, 2024, 8:30 AM-11:30 AM",
            status: "Approved"
        }
    ];

    const [students, setStudents] = useState(studentData);
    const toggleStatus = (index) => {
        setStudents((prevStudents) =>
            prevStudents.map((student, i) =>
                i === index
                    ? { ...student, status: student.status === "Approved" ? "Not Approved" : "Approved" }
                    : student
            )
        );
    };

        const renderTable = () => (
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr className="table-header-row">
                            <th className="table-header">STUDENT NAME</th>
                            <th className="table-header">GENDER</th>
                            <th className="table-header">TYPE</th>
                            <th className="table-header">DATE OF BIRTH</th>
                            <th className="table-header">GRADE LEVEL</th>
                            <th className="table-header">STRAND</th>
                            <th className="table-header">EMAIL ADDRESS</th>
                            <th className="table-header">CONTACT NO.</th>
                            <th className="table-header">APPOINTMENT TIME</th>
                            <th className="table-header">STATUS</th>
                        </tr>
                    </thead>
                    <tbody className="scrollable-tbody">
                        {studentData.map((student, index) => (
                            <tr key={index} className="table-row">
                                <td className="table-cell">{student.name}</td>
                                <td className="table-cell">{student.gender}</td>
                                <td className="table-cell">{student.type}</td>
                                <td className="table-cell">{student.dob}</td>
                                <td className="table-cell">{student.grade}</td>
                                <td className="table-cell">{student.strand}</td>
                                <td className="table-cell">{student.email}</td>
                                <td className="table-cell">{student.contact}</td>
                                <td className="table-cell">{student.appointment}</td>
                                <td className="table-cell">
                                    <label className="checkbox-container">
                                        <input type="checkbox" checked={student.status === "Approved"} 
                                        onChange={() => toggleStatus(index)}/>
                                        <span className="checkmark"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );


        const renderSuccessPage = () => (
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
                        <a href="/appointment" className="pre-reg-success-appointment-btn">
                            Book an Appointment
                        </a>
                    </div>
                </div>
            </div>
        );

        return (
            <>
                <AdminHeader />
                <div className="pre-reg-main-container">
                    <div className="pre-reg-title">MANAGE PRE-REGISTRATION</div>

                    {activeTab === 'table' ? (
                        (
                            <div>

                                {renderTable()}
                            </div>
                        )
                    ) : activeTab == 'appointment' ? (
                        <UpdateAppointment />
                    ) : (
                        <UpdatePreRegistration />
                    )}
                    <div><button
                        className={`mng-pre-reg-btn ${activeTab === 'appointment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointment')}
                    >
                        Update Availability of Appointment
                    </button>
                        <button
                            className={`mng-pre-reg-btn ${activeTab === 'UpdatePreRegistration' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pre-reg')}
                        >
                            Update Pre-Registration Form
                        </button> 
                    </div>
                </div>

            </>
        )
    }

export default ManagePreRegistration;