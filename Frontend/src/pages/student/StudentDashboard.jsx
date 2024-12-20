import React, { useState, useEffect } from "react";
import { Tabs, Tab, AppBar, Typography, Box, Container } from "@mui/material";
import { styled } from "@mui/system";
import TestCard from "./TestCard";
import axios from "axios";
import NoExams from "../../assets/happy.png";

// Custom styling for tabs to match Dashboard color schema
const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#D97706", // Yellow underline for active tab
  },
});

const StyledTab = styled(Tab)({
  textTransform: "none",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1E293B", // Dark Gray text for tabs
  "&.Mui-selected": {
    color: "#D97706", // Yellow for the selected tab
  },
});

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openTests, setOpenTests] = useState([]);
  const [mcqTests, setMcqTests] = useState([]);
  const [studentData, setStudentData] = useState({
    name: "",
    regno: "",
  });

  // Fetch student data and tests
  const fetchStudentData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/student/profile/", {
        withCredentials: true, // Include cookies for authentication
      });

      const { name, regno } = response.data;
      setStudentData({ name, regno });

      // Fetch open tests using the student's registration number
      fetchOpenTests(regno);
      fetchMcqTests(regno);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchOpenTests = async (regno) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/student/tests?regno=${regno}`, {
        withCredentials: true,
      });

      // Map and format test data for display
      const formattedTests = response.data.map((test) => ({
        contestId: test.contestId,
        name: test.assessmentOverview?.name || "Unknown Test",
        description: test.assessmentOverview?.description || "No description available.",
        starttime: test.assessmentOverview?.registrationStart || "No Time",
        endtime: test.assessmentOverview?.registrationEnd || "No Time",
        problems: test.problems || [],
        assessment_type: "coding",

      }));

      setOpenTests(formattedTests);
    } catch (error) {
      console.error("Error fetching open tests:", error);
    }
  };

  const fetchMcqTests = async (regno) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/student/mcq-tests?regno=${regno}`, {
        withCredentials: true,
      });

      console.log("Fetched MCQ tests:", response.data);  // Debugging statement

      // Map and format test data for display
      const formattedTests = response.data.map((test) => ({
        testId: test._id,  // Use _id as the unique identifier
        name: test.assessmentOverview?.name || "Unknown Test",
        description: test.assessmentOverview?.description || "No description available.",
        starttime: test.assessmentOverview?.registrationStart || "No Time",
        endtime: test.assessmentOverview?.registrationEnd || "No Time",
        questions: test.questions || [],
        assessment_type: "mcq",
      }));

      console.log("Formatted MCQ tests:", formattedTests);  // Debugging statement

      setMcqTests(formattedTests);
    } catch (error) {
      console.error("Error fetching MCQ tests:", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Combine open tests and MCQ tests
  const allTests = [...openTests, ...mcqTests];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Container maxWidth="lg">
        <AppBar position="static" color="transparent" elevation={0} className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-900">
            Hi! {studentData.name}
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600">
            Registration Number: {studentData.regno}
          </Typography>
        </AppBar>

        <Box className="bg-white p-6">
          <StyledTabs value={activeTab} onChange={handleTabChange}>
            <StyledTab label="Assigned to you" />
            <StyledTab label="Completed/Closed" />
          </StyledTabs>

          <Box className="mt-8">
            {activeTab === 0 && (
              <>
                {/* Combined Assessments Section */}
                <Typography variant="h6" className="font-bold text-gray-900 mb-4">
                  Assessments
                </Typography>
                {allTests.length > 0 ? (
                  allTests.map((test) => (
                    <TestCard
                      key={test.contestId || test.testId}
                      test={test}
                      assessment_type={test.assessment_type}
                    />
                  ))
                ) : (
                  <Box className="text-center">
                    <img
                      src={NoExams}
                      alt="No Exams"
                      className="mx-auto mb-4"
                      style={{ width: "300px", height: "300px" }}
                    />
                    <Typography variant="h6" className="font-medium text-gray-900">
                      Any day is a good day when <br /> there are no exams!
                    </Typography>
                  </Box>
                )}
              </>
            )}
            {activeTab === 1 && (
              <Typography
                variant="h6"
                className="font-medium text-gray-900 text-center"
              >
                Feature Coming Soon!
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default StudentDashboard;