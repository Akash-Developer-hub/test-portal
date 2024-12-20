import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Typography, Grid, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StatsCard from '../../components/staff/StatsCard';
import TestCard from '../../components/staff/TestCard';
import mcq from '../../assets/mcq.png';
import code from '../../assets/code.png';
import api from '../../axiosConfig'; // Axios instance
import { useNavigate } from 'react-router-dom';
import Loader from '../../layout/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    created: 0,
    students: 0,
    liveTests: 0,
    completedTests: 0,
  });
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contests and student stats
        const [contestResponse, studentStatsResponse] = await Promise.all([
          api.get('/contests', { withCredentials: true }),
          api.get('/students/stats', { withCredentials: true }),
        ]);

        const contests = contestResponse.data.contests || [];
        const created = contests.length;
        const liveTests = contests.filter((contest) => contest.status === 'Live').length;
        const completedTests = contests.filter(
          (contest) =>
            contest.status === 'Completed' || (contest.testEndDate && new Date(contest.testEndDate) < new Date())
        ).length;

        const totalStudents = studentStatsResponse.data.total_students || 0;

        setTests(contests);
        setFilteredTests(contests);
        setStats({ created, students: totalStudents, liveTests, completedTests });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterTests = (status) => {
    setActiveFilter(status);
    if (status === 'All') {
      setFilteredTests(tests);
    } else {
      setFilteredTests(tests.filter((test) => test.status === status));
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#00296B] to-[#0077B6] mx-3 rounded-b-2xl p-6 mb-8">
        <h2 className="text-3xl text-white mb-8 font-bold">Overall Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard icon={<FaChartBar />} title="Test Created" value={stats.created} />
          <StatsCard icon={<FaUsers />} title="No of Students" value={stats.students} />
          <StatsCard icon={<FaClipboardList />} title="No of Live Test" value={stats.liveTests} />
          <StatsCard icon={<FaCheckCircle />} title="No of Completed Test" value={stats.completedTests} />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs and Create Test Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            {['All', 'Live', 'Completed', 'Upcoming'].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 ${
                  activeFilter === status ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => filterTests(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <button
            className="px-6 py-2 bg-[#00296B] text-white rounded-lg hover:bg-[#0077B6] transition-colors"
            onClick={handleModalOpen}
          >
            Create Test
          </button>
        </div>

        {/* Test Cards Grid */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map((test) => {
              const title = test.assessmentName || 'Unnamed Contest';
              const type = test.type || 'General';
              const date = test.endDate
                ? new Date(test.endDate).toLocaleDateString()
                : 'Date Unavailable';
              const category = test.category || 'Uncategorized';
              const status = test.status || 'Upcoming';

              return (
                <TestCard
                  key={test._id || test.contestId}
                  contestId={test.contestId || test._id} 
                  title={title}
                  type={type} 
                  date={date}
                  category={category}
                  stats={{
                    Assigned: test.assignedCount || 0,
                    Register: test.register || 0,
                    Completed: test.complete || 0,
                  }}
                  status={status}
                  onView={() => console.log('Viewing test:', test._id || test.contestId)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Create Test */}
      <Dialog open={isModalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" align="center" fontWeight="bold">
            Select Test Type
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '230px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': { backgroundColor: '#F5F5F5' },
                }}
                onClick={() => {
                  navigate('/mcq/details');
                  handleModalClose();
                }}
              >
                <img src={mcq} alt="Skill Assessment" style={{ maxWidth: '80px', margin: '0 auto' }} />
                <Typography variant="h6" mt={2}>
                  Skill Assessment
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Evaluations to test knowledge and skills across different topics
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '230px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': { backgroundColor: '#F5F5F5' },
                }}
                onClick={() => {
                  navigate('/coding/details');
                  handleModalClose();
                }}
              >
                <img src={code} alt="Code Contest" style={{ maxWidth: '80px', margin: '0 auto' }} />
                <Typography variant="h6" mt={2}>
                  Code Contest
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Challenges to assess programming and problem-solving skills
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: 'center', width: '100%', marginBottom: '16px' }}
          >
            You can select a test type to proceed or close the dialog.
          </Typography>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;