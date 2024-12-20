import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  TextField,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Mcq_Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalQuestions: 0,
    totalSections: 0,
    totalDuration: "00:00:00",
    maximumMark: 0,
  });
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filters, setFilters] = useState({ collegename: "", dept: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { contestId } = useParams();

  // Fetching data from localStorage on component mount
  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("selectedQuestions");
    if (storedQuestions) {
      setSelectedQuestions(JSON.parse(storedQuestions));
    }

    // Retrieving stats from localStorage
    const statsFromLocalStorage = JSON.parse(localStorage.getItem("assessmentStats"));
    if (statsFromLocalStorage) {
      setDashboardStats({
        totalSections: statsFromLocalStorage.totalSections || 0,
        totalDuration: statsFromLocalStorage.totalDuration || "00:00:00",
        maximumMark: statsFromLocalStorage.maximumMark || 0,
        totalQuestions: statsFromLocalStorage.totalQuestions || 0, // Fetch totalQuestions from localStorage
      });
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/student/");
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const applyFilters = () => {
      const filtered = students.filter(
        (student) =>
          (filters.collegename ? student.collegename.includes(filters.collegename) : true) &&
          (filters.dept ? student.dept.includes(filters.dept) : true)
      );
      setFilteredStudents(filtered);
    };

    applyFilters();
  }, [filters, students]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map((student) => student.regno));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (regno) => {
    setSelectedStudents((prev) =>
      prev.includes(regno)
        ? prev.filter((id) => id !== regno)
        : [...prev, regno]
    );
  };

  // Fetch Questions from MongoDB via Backend
  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("contestToken");
      if (!token) {
        alert("Unauthorized access. Please log in again.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/mcq/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedQuestions = response.data.questions || [];
      setQuestions(fetchedQuestions);

      // Updating the dashboard stats with the total questions
      setDashboardStats((prev) => ({
        ...prev,
        totalQuestions: fetchedQuestions.length,
      }));
    } catch (error) {
      console.error("Error fetching questions:", error.response?.data || error.message);
      alert("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Finish Contest Functionality
  const handleFinish = async () => {
    try {
      const token = localStorage.getItem("contestToken");
      if (!token) {
        alert("Unauthorized access. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/finish-contest",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Contest finished successfully! Question IDs have been saved.");
      } else {
        alert("Failed to finish the contest. Please try again.");
      }
    } catch (error) {
      console.error("Error finishing contest:", error.response?.data || error.message);
      alert("Failed to finish the contest. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentQuestion(null);
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem("contestToken");
      if (!token) {
        alert("Unauthorized access. Please log in again.");
        return;
      }

      const response = await axios.post("http://localhost:8000/api/mcq/publish/", {
        students: selectedStudents,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert("Questions published successfully!");
        sessionStorage.clear(selectedStudents)
        navigate(`/staffdashboard`);
      } else {
        alert("Failed to publish questions.");
      }
    } catch (error) {
      console.error("Error publishing questions:", error);
      alert("An error occurred while publishing questions.");
    }
    setPublishDialogOpen(false);
  };

  // Load Data on Component Mount
  useEffect(() => {
    fetchQuestions();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="max-w-5xl w-full">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 mt-8">
          {[
            {
              label: "Total Questions",
              value: dashboardStats.totalQuestions,
              icon: "❓",
            },
            {
              label: "Total Sections",
              value: dashboardStats.totalSections,
              icon: "📂",
            },
            {
              label: "Total Duration",
              value: dashboardStats.totalDuration,
              icon: "⏱️",
            },
            {
              label: "Maximum Mark",
              value: dashboardStats.maximumMark,
              icon: "📝",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg border-l-4 border-yellow-400"
            >
              <div className="text-yellow-500 text-4xl">{item.icon}</div>
              <div className="text-right">
                <h3 className="text-gray-500 text-sm font-medium">
                  {item.label}
                </h3>
                <p className="text-xl font-semibold text-gray-800">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Questions List */}
        {!isLoading && questions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Loaded Questions
            </h3>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Options</TableCell>
                    <TableCell>Answer</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Tags</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question, index) => (
                    <TableRow key={index}>
                      <TableCell>{question.question}</TableCell>
                      <TableCell>{question.options.join(", ")}</TableCell>
                      <TableCell>{question.answer}</TableCell>
                      <TableCell>{question.level}</TableCell>
                      <TableCell>{question.tags.join(", ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center mt-16">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-yellow-500" />
            <p className="text-gray-600 mt-4">Loading questions...</p>
          </div>
        )}

        {/* No Questions Fallback */}
        {!isLoading && questions.length === 0 && (
          <div className="text-center mt-16">
            <p className="text-gray-600">No questions available in the database.</p>
          </div>
        )}

        {/* Finish Button */}
        {!isLoading && questions.length > 0 && (
          <div className="flex justify-end mt-10">
            <button
              onClick={() => setPublishDialogOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Publish
            </button>
          </div>
        )}

        <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)} fullWidth maxWidth="lg">
          <DialogTitle>Select Students</DialogTitle>
          <DialogContent>
            <Box mb={3}>
              <TextField
                label="Filter by College Name"
                name="collegename"
                variant="outlined"
                fullWidth
                margin="dense"
                value={filters.collegename}
                onChange={handleFilterChange}
              />
              <TextField
                label="Filter by Department"
                name="dept"
                variant="outlined"
                fullWidth
                margin="dense"
                value={filters.dept}
                onChange={handleFilterChange}
              />
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedStudents.length > 0 &&
                          selectedStudents.length < filteredStudents.length
                        }
                        checked={
                          filteredStudents.length > 0 &&
                          selectedStudents.length === filteredStudents.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Registration Number</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>College Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <TableRow key={student.regno} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedStudents.includes(student.regno)}
                            onChange={() => handleStudentSelect(student.regno)}
                          />
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.regno}</TableCell>
                        <TableCell>{student.dept}</TableCell>
                        <TableCell>{student.collegename}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setPublishDialogOpen(false)}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={handlePublish} color="primary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Mcq_Dashboard;
