import React from 'react';
import './ExpectedStudents.css';

const ExpectedStudents = () => {
    const gradeData = [
        { grade: 'Nursery', approvedCount: 5, pendingCount: 3 },
        { grade: 'Kinder 1', approvedCount: 6, pendingCount: 2 },
        { grade: 'Kinder 2', approvedCount: 7, pendingCount: 4 },
        { grade: 'Grade 1', approvedCount: 8, pendingCount: 2 },
        { grade: 'Grade 2', approvedCount: 5, pendingCount: 5 },
        { grade: 'Grade 3', approvedCount: 7, pendingCount: 3 },
        { grade: 'Grade 4', approvedCount: 9, pendingCount: 1 },
        { grade: 'Grade 5', approvedCount: 6, pendingCount: 4 },
        { grade: 'Grade 6', approvedCount: 4, pendingCount: 6 },
        { grade: 'Grade 7', approvedCount: 8, pendingCount: 2 },
        { grade: 'Grade 8', approvedCount: 7, pendingCount: 3 },
        { grade: 'Grade 9', approvedCount: 6, pendingCount: 4 },
        { grade: 'Grade 10', approvedCount: 5, pendingCount: 5 },
        { 
            grade: 'Grade 11',
            strands: [
                { name: 'ABM', approvedCount: 4, pendingCount: 3 },
                { name: 'STEM', approvedCount: 6, pendingCount: 4 },
                { name: 'HUMSS', approvedCount: 3, pendingCount: 5 }
            ]
        },
        {
            grade: 'Grade 12',
            strands: [
                { name: 'ABM', approvedCount: 5, pendingCount: 2 },
                { name: 'STEM', approvedCount: 7, pendingCount: 3 },
                { name: 'HUMSS', approvedCount: 4, pendingCount: 4 }
            ]
        }
    ];

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
                                if (grade.strands) {
                                    return grade.strands.map((strand, index) => {
                                        const total = strand.approvedCount + strand.pendingCount;
                                        return (
                                            <tr key={`${grade.grade}-${strand.name}`}>
                                                {index === 0 && (
                                                    <td rowSpan={grade.strands.length}>
                                                        {grade.grade}
                                                    </td>
                                                )}
                                                <td>{strand.name}</td>
                                                <td>{strand.approvedCount}</td>
                                                <td>{strand.pendingCount}</td>
                                                <td>{total}</td>
                                                <td>
                                                    <button 
                                                        className={`btn-status ${strand.pendingCount > 0 ? 'pending' : 'approved'}`}
                                                    >
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
                                                <button 
                                                    className={`btn-status ${grade.pendingCount > 0 ? 'pending' : 'approved'}`}
                                                >
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