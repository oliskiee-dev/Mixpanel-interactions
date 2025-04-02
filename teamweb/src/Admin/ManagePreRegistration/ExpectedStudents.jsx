import React, { useEffect, useState } from 'react';
import './ExpectedStudents.css';

const ExpectedStudents = () => {
    const [gradeData, setGradeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/preregistration');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                
                // Transform data into required format
                const groupedData = processPreRegistrationData(data.preregistration);
                setGradeData(groupedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processPreRegistrationData = (data) => {
        // Define exact grade order with correct capitalization and spacing
        const gradeOrder = {
            "Nursery": 1,
            "Kinder 1": 2,
            "Kinder 2": 3,
            "Grade 1": 4, "Grade 2": 5, "Grade 3": 6, "Grade 4": 7,
            "Grade 5": 8, "Grade 6": 9, "Grade 7": 10, "Grade 8": 11,
            "Grade 9": 12, "Grade 10": 13, "Grade 11": 14, "Grade 12": 15
        };
    
        const gradeMap = {};
    
        data.forEach(student => {
            const { grade_level, strand, status } = student;
            const isApproved = status === 'approved';
            
            // Normalize grade level for consistent matching
            const normalizedGradeLevel = grade_level.trim();
    
            if (!gradeMap[normalizedGradeLevel]) {
                gradeMap[normalizedGradeLevel] = { 
                    grade: normalizedGradeLevel, 
                    approvedCount: 0, 
                    pendingCount: 0, 
                    strands: {} 
                };
            }
    
            if (strand) {
                if (!gradeMap[normalizedGradeLevel].strands[strand]) {
                    gradeMap[normalizedGradeLevel].strands[strand] = { 
                        name: strand, 
                        approvedCount: 0, 
                        pendingCount: 0 
                    };
                }
                if (isApproved) {
                    gradeMap[normalizedGradeLevel].strands[strand].approvedCount++;
                } else {
                    gradeMap[normalizedGradeLevel].strands[strand].pendingCount++;
                }
            } else {
                if (isApproved) {
                    gradeMap[normalizedGradeLevel].approvedCount++;
                } else {
                    gradeMap[normalizedGradeLevel].pendingCount++;
                }
            }
        });
    
        return Object.values(gradeMap)
            .map(grade => ({
                ...grade,
                strands: Object.values(grade.strands),
                // Store sorting value to ensure proper sorting
                sortOrder: gradeOrder[grade.grade] || 99
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder);
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="content-container">
            <div className="page-header">
                <h1>Students Overview</h1>
                <p>Track approved and pending students per grade level</p>
            </div>

            <div className="data-table-container">
                <div className="table-wrapper">
                    <table className="expected-students-table">
                        <thead>
                            <tr>
                                <th>Grade Level</th>
                                <th>Strand</th>
                                <th>Approved</th>
                                <th>Pending</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradeData.map((grade) => {
                                if (grade.strands.length > 0) {
                                    return grade.strands.map((strand, index) => {
                                        const total = strand.approvedCount + strand.pendingCount;
                                        return (
                                            <tr key={`${grade.grade}-${strand.name}`}>
                                                {index === 0 && (
                                                    <td rowSpan={grade.strands.length}>{grade.grade}</td>
                                                )}
                                                <td>{strand.name}</td>
                                                <td>{strand.approvedCount}</td>
                                                <td>{strand.pendingCount}</td>
                                                <td>{total}</td>
                                                <td>
                                                    <button className={`btn-status ${strand.pendingCount > 0 ? 'pending' : 'approved'}`}>
                                                        {strand.pendingCount > 0 ? 'Processing' : 'Complete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    });
                                } else {
                                    const total = grade.approvedCount + grade.pendingCount;
                                    return (
                                        <tr key={grade.grade}>
                                            <td>{grade.grade}</td>
                                            <td>-</td>
                                            <td>{grade.approvedCount}</td>
                                            <td>{grade.pendingCount}</td>
                                            <td>{total}</td>
                                            <td>
                                                <button className={`btn-status ${grade.pendingCount > 0 ? 'pending' : 'approved'}`}>
                                                    {grade.pendingCount > 0 ? 'Processing' : 'Complete'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpectedStudents;