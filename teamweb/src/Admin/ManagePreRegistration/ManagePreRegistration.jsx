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

    // useEffect(() => {
    //     // Check for existing form data when component mounts
    //     const storedData = sessionStorage.getItem('preRegFormData');
    //     if (storedData) {
    //         setFormData(JSON.parse(storedData));
    //     }
    // }, []);

    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    //     setFormErrors({ ...formErrors, [e.target.name]: "" });
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const errors = validateForm(formData);
    //     setFormErrors(errors);

    //     if (Object.keys(errors).length === 0) {
    //         sessionStorage.setItem('preRegFormData', JSON.stringify(formData));
    //         window.location.href = '/confirmregistration';
    //     }
    // };

    // const validateForm = (data) => {
    //     let errors = {};

    //     if (!data.firstName?.trim()) {
    //         errors.firstName = "First Name is required";
    //     }
    //     if (!data.lastName?.trim()) {
    //         errors.lastName = "Last Name is required";
    //     }
    //     if (!data.dateOfBirth?.trim()) {
    //         errors.dateOfBirth = "Date of Birth is required";
    //     }
    //     if (!data.gender?.trim()) {
    //         errors.gender = "Gender is required";
    //     }
    //     if (!data.nationality?.trim()) {
    //         errors.nationality = "Nationality is required";
    //     }
    //     if (!data.email?.trim()) {
    //         errors.email = "Email is required";
    //     } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    //         errors.email = "Email is invalid";
    //     }
    //     if (!data.mobileNumber?.trim()) {
    //         errors.mobileNumber = "Mobile Number is required";
    //     }
    //     if (!data.isNewStudent) {
    //         errors.isNewStudent = "Please select if you are a new or old student";
    //     }
    //     if (!data.parentFirstName?.trim()) {
    //         errors.parentFirstName = "Parent's First Name is required";
    //     }
    //     if (!data.parentLastName?.trim()) {
    //         errors.parentLastName = "Parent's Last Name is required";
    //     }
    //     if (!data.parentMobileNumber?.trim()) {
    //         errors.parentMobileNumber = "Parent's Mobile Number is required";
    //     }
    //     if (!data.yearLevel) {
    //         errors.yearLevel = "Grade Level is required";
    //     }
    //     if ((data.yearLevel === '11' || data.yearLevel === '12') && !data.strand) {
    //         errors.strand = "Strand is required for Senior High School students";
    //     }

    //     return errors;
    // };

    // useEffect(() => {
    //     const totalFields = 12; // Base number of required fields excluding strand
    //     let filledFields = Object.entries(formData).filter(([key, value]) => {
    //         // Don't count strand field for grades below 11
    //         if (key === 'strand' && !['11', '12'].includes(formData.yearLevel)) {
    //             return false;
    //         }
    //         return value !== "";
    //     }).length;

    //     // If grade 11 or 12 is selected, include strand in total required fields
    //     const adjustedTotalFields = ['11', '12'].includes(formData.yearLevel) ? totalFields + 1 : totalFields;

    //     const calculatedProgress = (filledFields / adjustedTotalFields) * 100;
    //     setProgress(Math.min(calculatedProgress, 100)); // Ensure progress doesn't exceed 100%
    // }, [formData]);

    const studentData = [
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00e9')",
            name: "Juan Dela Cruz",
            gender: "Male",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639494001323",
            age: 21, // Example age
            strand: "STEM",
            grade_level: "Grade 11",
            email: "juandlcrz@gmail.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Approved",
            appointment_date: "May 15, 2024",
            preferred_time: "7:00 AM-11:00 AM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00e9')",
            name: "Christian Reynancia",
            gender: "Male",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639494001323",
            age: 21, // Example age
            strand: "STEM",
            grade_level: "Grade 11",
            email: "juandlcrz@gmail.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Approved",
            appointment_date: "",
            preferred_time: "",
            purpose_of_visit: "", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00e9')",
            name: "Andrew Reynancia",
            gender: "Male",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639494001323",
            age: 21, // Example age
            strand: "STEM",
            grade_level: "Grade 11",
            email: "juandlcrz@gmail.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "",
            preferred_time: "",
            purpose_of_visit: "", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "ABM",
            grade_level: "Grade 12",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "ABM",
            grade_level: "Grade 12",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "ABM",
            grade_level: "Grade 12",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "ABM",
            grade_level: "Grade 2",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "STEM",
            grade_level: "Grade 12",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
    
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "",
            grade_level: "Grade 1",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
    
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "",
            grade_level: "Grade 3",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
    
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "",
            grade_level: "Grade 10",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "NEW",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
    
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "",
            grade_level: "Grade 2",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "OLD",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
    
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "ABM",
            grade_level: "Grade 2",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "OLD",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
    
        {
            _id: "ObjectId('67c0015l77e5af4d14bc00f0')",
            name: "Maria Santos",
            gender: "Female",
            date_of_birth: "Feb 11, 2003",
            phone_number: "+639123456789",
            age: 20, // Example age
            strand: "ABM",
            grade_level: "Grade 2",
            email: "maria.santos@email.com",
            nationality: "Filipino", // Example data
            parent_guardian_name: "N/A",
            parent_guardian_number: "N/A",
            isNewStudent: "OLD",
            status: "Pending",
            appointment_date: "May 16, 2024",
            preferred_time: "9:00 AM-12:00 PM",
            purpose_of_visit: "Enrollment", // Example
            createdAt: "2025-02-27T06:08:17.632+00:00",
            updatedAt: "2025-02-27T06:08:17.632+00:00",
            
        },
    
    
        // Add other entries following this structure
    ];
    

    const [students, setStudents] = useState(studentData);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedStrand, setSelectedStrand] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [expandedRow, setExpandedRow] = useState(null);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleGradeChange = (e) => {
        setSelectedGrade(e.target.value);
    };

    const handleStrandChange = (e) => {
        setSelectedStrand(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleStatusChange = (index) => {
        const updatedStudents = [...students];
        const originalIndex = students.findIndex((s) => s === filteredStudents[index]);
    
        // Toggle status between "Pending" and "Approved"
        updatedStudents[originalIndex].status =
            updatedStudents[originalIndex].status === "Approved" ? "Pending" : "Approved";
    
        if (updatedStudents[originalIndex].status === "Approved") {
            sendEmail(updatedStudents[originalIndex].email, updatedStudents[originalIndex].name);
        }
    
        setStudents(updatedStudents);
    };

    const sendEmail = (email, name) => {
        console.log(`Sending email to ${email} for ${name}...`);
        alert(`Approval email sent to ${email}`);
    };

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const filteredStudents = students.filter((student) => {
        const matchesName = student.name.toLowerCase().includes(searchTerm);
        const matchesGrade =
            selectedGrade === "" || student.grade_level.toLowerCase() === `grade ${selectedGrade.toLowerCase()}`;
        const matchesStrand =
            selectedStrand === "" || student.strand.toLowerCase() === selectedStrand.toLowerCase();
        const matchesType =
            selectedType === "" || student.isNewStudent.toLowerCase() === selectedType.toLowerCase();

        return matchesName && matchesGrade && matchesStrand && matchesType;
    });

    const renderTable = () => (
        <div className="table-wrapper">
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
                <th className="table-header">PHONE NUMBER</th>
                <th className="table-header">PURPOSE OF VISIT</th>
                <th className="table-header">STATUS</th>
            </tr>
        </thead>
    </table>
    <div className="table-body-wrapper">
        <table className="custom-table">
            <tbody>
                {filteredStudents.map((student, index) => (
                    <React.Fragment key={index}>
                        <tr className="table-row">
                            <td className="table-cell">{student.name}</td>
                            <td className="table-cell">{student.gender}</td>
                            <td className="table-cell">{student.isNewStudent}</td>
                            <td className="table-cell">{student.date_of_birth}</td>
                            <td className="table-cell">{student.grade_level}</td>
                            <td className="table-cell">{student.strand}</td>
                            <td className="table-cell">{student.email}</td>
                            <td className="table-cell">{student.phone_number}</td>
                            <td className="table-cell">
                                <button
                                    className="expand-button"
                                    onClick={() => toggleRow(index)}
                                >
                                    {student.purpose_of_visit}
                                </button>
                            </td>
                            <td className="status">
                                <button
                                    className="status-button"
                                    onClick={() => handleStatusChange(index)}
                                >
                                    {student.status}
                                </button>
                            </td>
                        </tr>
                        {expandedRow === index && (
                            <tr className="expanded-row">
                                <td className="expanded-cell" colSpan="11">
                                    <strong>Appointment Date & Time:</strong>{" "}
                                    {`${student.appointment_date}, ${student.preferred_time}`}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    </div>
</div>

    );
    
    return (
        <div>
            <AdminHeader />
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search by student name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                <select value={selectedGrade} onChange={handleGradeChange} className="filter-dropdown">
                    <option value="">All Grades</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={(i + 1).toString()}>
                            Grade {i + 1}
                        </option>
                    ))}
                </select>
                <select value={selectedStrand} onChange={handleStrandChange} className="filter-dropdown">
                    <option value="">All Strands</option>
                    <option value="ABM">ABM</option>
                    <option value="STEM">STEM</option>
                    <option value="HUMSS">HUMSS</option>
                </select>
                <select value={selectedType} onChange={handleTypeChange} className="filter-dropdown">
                    <option value="">All Types</option>
                    <option value="New">New</option>
                    <option value="Old">Old</option>
                </select>
            </div>
            {activeTab === "table" && renderTable()}
            {activeTab === "appointment" && <UpdateAppointment />}
            {/* {activeTab === "pre-reg" && <UpdatePreRegistration />} */}
            
            <div>
                <button
                    className={`mng-pre-reg-btn ${activeTab === "appointment" ? "active" : ""}`}
                    onClick={() => setActiveTab("appointment")}
                >
                    Update Availability of Appointment
                </button>

                <button
                    className={`mng-pre-reg-btn ${activeTab === "table" ? "active" : ""}`}
                    onClick={() => setActiveTab("table")}
                >
                    View Table
                </button>
            </div>
        </div>
    );
    }

export default ManagePreRegistration;