import React, { useState, useEffect } from 'react';
import './ViewReports.css';

const ViewReports = () => {
  // State for storing registration data
  const [registrationData, setRegistrationData] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [totalApproved, setTotalApproved] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sectionCounts, setSectionCounts] = useState({
    earlyChildhood: 0,
    elementary: 0,
    juniorHigh: 0,
    seniorHigh: 0
  });
  
  // State for report view
  const [reportView, setReportView] = useState('byGrade');

  // Grade levels configuration
  const gradeLevels = {
    earlyChildhood: ['Nursery', 'Kinder1', 'Kinder2'],
    elementary: ['1', '2', '3', '4', '5', '6'],
    juniorHigh: ['7', '8', '9', '10'],
    seniorHigh: {
      '11': ['ABM', 'STEM', 'HUMSS'],
      '12': ['ABM', 'STEM', 'HUMSS']
    }
  };
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Export functionality
  const handleExport = () => {
    // Create CSV content
    const csvRows = [
      ['First Name', 'Last Name', 'Year Level', 'Strand', 'Registration Date', 'Student Type']
    ];

    registrationData.forEach(student => {
      csvRows.push([
        student.firstName,
        student.lastName,
        student.yearLevel,
        student.strand || 'N/A',
        student.registrationDate,
        student.isNewStudent === 'new' ? 'New Student' : 'Returning Student'
      ]);
    });

    // Convert to CSV string
    const csvContent = csvRows.map(e => e.join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registration_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Refresh functionality
  const handleRefresh = () => {
    // Update the last updated timestamp
    setLastUpdated(new Date());
    
    // In a real-world scenario, you might want to fetch fresh data from an API
    console.log('Refreshing data...');
  };

  // Fetch registration data
  useEffect(() => {
    const fetchRegistrationData = () => {
      try {
        const storedDataString = sessionStorage.getItem('preRegFormData');
        let registrations = [];
        
        if (storedDataString) {
          const storedData = JSON.parse(storedDataString);
          registrations.push(storedData);
        }
        
        // Mock registrations to populate the dashboard
        registrations = [
          ...registrations,
          { firstName: "John", lastName: "Doe", yearLevel: "Nursery", isNewStudent: "new", registrationDate: "2025-01-15" },
          { firstName: "Jane", lastName: "Smith", yearLevel: "Nursery", isNewStudent: "new", registrationDate: "2025-01-20" },
          { firstName: "Sam", lastName: "Johnson", yearLevel: "Kinder1", isNewStudent: "new", registrationDate: "2025-02-05" },
          { firstName: "Alice", lastName: "Williams", yearLevel: "Kinder2", isNewStudent: "new", registrationDate: "2025-02-15" },
          { firstName: "Mike", lastName: "Brown", yearLevel: "1", isNewStudent: "new", registrationDate: "2025-03-01" },
          { firstName: "Emma", lastName: "Davis", yearLevel: "2", isNewStudent: "new", registrationDate: "2025-03-10" },
          { firstName: "Noah", lastName: "Miller", yearLevel: "3", isNewStudent: "old", registrationDate: "2025-03-15" },
          { firstName: "Olivia", lastName: "Wilson", yearLevel: "4", isNewStudent: "old", registrationDate: "2025-03-20" },
          { firstName: "James", lastName: "Moore", yearLevel: "5", isNewStudent: "old", registrationDate: "2025-04-01" },
          { firstName: "Sophia", lastName: "Taylor", yearLevel: "6", isNewStudent: "old", registrationDate: "2025-04-05" },
          { firstName: "William", lastName: "Anderson", yearLevel: "7", isNewStudent: "new", registrationDate: "2025-04-10" },
          { firstName: "Ava", lastName: "Thomas", yearLevel: "8", isNewStudent: "old", registrationDate: "2025-04-15" },
          { firstName: "Benjamin", lastName: "Jackson", yearLevel: "9", isNewStudent: "new", registrationDate: "2025-05-01" },
          { firstName: "Mia", lastName: "White", yearLevel: "10", isNewStudent: "old", registrationDate: "2025-05-05" },
          { firstName: "Lucas", lastName: "Harris", yearLevel: "11", strand: "ABM", isNewStudent: "new", registrationDate: "2025-05-10" },
          { firstName: "Charlotte", lastName: "Martin", yearLevel: "11", strand: "STEM", isNewStudent: "new", registrationDate: "2025-05-15" },
          { firstName: "Henry", lastName: "Thompson", yearLevel: "11", strand: "HUMSS", isNewStudent: "old", registrationDate: "2025-06-01" },
          { firstName: "Amelia", lastName: "Garcia", yearLevel: "12", strand: "ABM", isNewStudent: "old", registrationDate: "2025-06-05" },
          { firstName: "Alex", lastName: "Martinez", yearLevel: "12", strand: "STEM", isNewStudent: "new", registrationDate: "2025-06-10" },
          { firstName: "Harper", lastName: "Robinson", yearLevel: "12", strand: "HUMSS", isNewStudent: "old", registrationDate: "2025-06-15" }
        ];
        
        setRegistrationData(registrations);
      } catch (error) {
        console.error("Error fetching registration data:", error);
        setRegistrationData([]);
      }
    };
    
    fetchRegistrationData();
  }, []);
  
  // Process registration data into grade counts
  useEffect(() => {
    if (registrationData.length > 0) {
      const processedData = [];
      let totalStudents = 0;
      let earlyChildhoodCount = 0;
      let elementaryCount = 0;
      let juniorHighCount = 0;
      let seniorHighCount = 0;
      
      // Count early childhood students
      gradeLevels.earlyChildhood.forEach(grade => {
        const count = registrationData.filter(student => student.yearLevel === grade).length;
        processedData.push({ 
          grade: grade === 'Kinder1' ? 'Kinder 1' : grade === 'Kinder2' ? 'Kinder 2' : grade, 
          approved: count 
        });
        earlyChildhoodCount += count;
        totalStudents += count;
      });
      
      // Count elementary students
      gradeLevels.elementary.forEach(grade => {
        const count = registrationData.filter(student => student.yearLevel === grade).length;
        processedData.push({ grade: `Grade ${grade}`, approved: count });
        elementaryCount += count;
        totalStudents += count;
      });
      
      // Count junior high students
      gradeLevels.juniorHigh.forEach(grade => {
        const count = registrationData.filter(student => student.yearLevel === grade).length;
        processedData.push({ grade: `Grade ${grade}`, approved: count });
        juniorHighCount += count;
        totalStudents += count;
      });
      
      // Count senior high students
      ['11', '12'].forEach(gradeLevel => {
        gradeLevels.seniorHigh[gradeLevel].forEach(strand => {
          const count = registrationData.filter(
            student => student.yearLevel === gradeLevel && student.strand === strand
          ).length;
          processedData.push({ grade: `Grade ${gradeLevel} - ${strand}`, approved: count });
          seniorHighCount += count;
          totalStudents += count;
        });
      });
      
      setGradesData(processedData);
      setTotalApproved(totalStudents);
      setSectionCounts({
        earlyChildhood: earlyChildhoodCount,
        elementary: elementaryCount,
        juniorHigh: juniorHighCount,
        seniorHigh: seniorHighCount
      });
    }
  }, [registrationData]);

  return (
    <div className="registration-reports-container">
      <div className="reports-header">
        <h1>Registration Reports</h1>
        <div className="reports-header-actions">
          <button className="btn btn-export" onClick={handleExport}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button className="btn btn-refresh" onClick={handleRefresh}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Total Students */}
      <div className="total-students-card">
        <div className="total-students-count">{totalApproved}</div>
        <div className="total-students-label">Pre-registered students</div>
      </div>

      {/* Report Tabs */}
      <div className="report-tabs">
        {['byGrade', 'newVsOld', 'byMonth'].map((view) => (
          <div 
            key={view} 
            className={`report-tab ${reportView === view ? 'active' : ''}`}
            onClick={() => setReportView(view)}
          >
            {view === 'byGrade' ? 'By Grade Level' : 
             view === 'newVsOld' ? 'New vs. Returning' : 
             'By Month'}
          </div>
        ))}
      </div>

      {/* By Grade View */}
      {reportView === 'byGrade' && (
        <>
          {/* Early Childhood */}
          <div className="grade-level-section">
            <div className="grade-level-section-header">Early Childhood Education</div>
            <div className="grade-level-section-content">
              {gradesData.slice(0, 3).map((gradeInfo, index) => (
                <div key={index} className="grade-level-item">
                  <span className="grade-level-item-label">{gradeInfo.grade}</span>
                  <span className="grade-level-item-count">Approved: {gradeInfo.approved}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Elementary */}
          <div className="grade-level-section">
            <div className="grade-level-section-header">Elementary</div>
            <div className="grade-level-section-content">
              {gradesData.slice(3, 9).map((gradeInfo, index) => (
                <div key={index} className="grade-level-item">
                  <span className="grade-level-item-label">{gradeInfo.grade}</span>
                  <span className="grade-level-item-count">Approved: {gradeInfo.approved}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Junior High */}
          <div className="grade-level-section">
            <div className="grade-level-section-header">Junior High School</div>
            <div className="grade-level-section-content">
              {gradesData.slice(9, 13).map((gradeInfo, index) => (
                <div key={index} className="grade-level-item">
                  <span className="grade-level-item-label">{gradeInfo.grade}</span>
                  <span className="grade-level-item-count">Approved: {gradeInfo.approved}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Senior High - Grade 11 */}
          <div className="grade-level-section">
            <div className="grade-level-section-header">Senior High School - Grade 11</div>
            <div className="grade-level-section-content">
              {gradesData.slice(13, 16).map((gradeInfo, index) => (
                <div key={index} className="grade-level-item">
                  <span className="grade-level-item-label">{gradeInfo.grade}</span>
                  <span className="grade-level-item-count">Approved: {gradeInfo.approved}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Senior High - Grade 12 */}
          <div className="grade-level-section">
            <div className="grade-level-section-header">Senior High School - Grade 12</div>
            <div className="grade-level-section-content">
              {gradesData.slice(16).map((gradeInfo, index) => (
                <div key={index} className="grade-level-item">
                  <span className="grade-level-item-label">{gradeInfo.grade}</span>
                  <span className="grade-level-item-count">Approved: {gradeInfo.approved}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* New vs Old Students View */}
      {reportView === 'newVsOld' && (
        <div className="grade-level-section">
          <div className="grade-level-section-header">New vs. Returning Students</div>
          <div className="grade-level section-content">
            <div className="grade-level-item">
              <span className="grade-level-item-label">New Students</span>
              <span className="grade-level-item-count">
                {registrationData.filter(s => s.isNewStudent === 'new').length}
              </span>
            </div>
            <div className="grade-level-item">
              <span className="grade-level-item-label">Returning Students</span>
              <span className="grade-level-item-count">
                {registrationData.filter(s => s.isNewStudent === 'old').length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* By Month View */}
      {reportView === 'byMonth' && (
        <div className="grade-level-section">
          <div className="grade-level-section-header">Monthly Registration Trends</div>
          <div className="grade-level-section-content">
            {months.map(month => {
              const monthRegistrations = registrationData.filter(
                s => new Date(s.registrationDate).getMonth() === months.indexOf(month)
              );
              return (
                <div key={month} className="grade-level-item">
                  <span className="grade-level-item-label">{month}</span>
                  <span className="grade-level-item-count">{monthRegistrations.length}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="last-updated">
        Last updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString()} | Academic Year: 2025-2026
      </div>
    </div>
  );
};

export default ViewReports;