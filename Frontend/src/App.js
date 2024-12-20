import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ContestPage from './pages/staff/coding/ContestPage';
import StartContest from './pages/staff/coding/StartContest';
import SelectTestOption from './pages/staff/coding/SelectTestOption';
import FileUpload from './pages/staff/coding/FileUpload';
import ManualSelectUI from './pages/staff/coding/ManualSelectUI';
import HrUpload from './pages/staff/coding/HrUploadPage';
import OnebyOne from './pages/staff/coding/OnebyOne';
import ManualPage from './pages/staff/coding/ManualPage';
import ContestDashboard from './pages/staff/coding/ContestDashboard';
import Login from './pages/staff/Login';
import Signup from './pages/staff/Signup';
import Dashboard from './pages/staff/Dashboard';
import GeneralHome from './pages/GeneralHome';
import StudentRegister from './pages/student/StudentRegister';
import StudentLogin from './pages/student/StudentLogin';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import Navbar from './pages/student/Navbar';
import StaffNavbar from './pages/staff/StaffNavbar';
import TestInstructions from './pages/student/TestInstruction';
import ViewContest from './pages/staff/coding/ViewContest';
import Assesment from './pages/staff/coding/Assesment';
import QuestionsLibrary from './pages/staff/coding/QuestionsLibrary';
import Questions from './pages/staff/coding/Questions';
import Library from './pages/Library';
import QuestionPreview from "./pages/staff/coding/QuestionPreview";
import QuestionDashboard from "./pages/staff/coding/QuestionDashboard";
import BulkUpload from "./pages/staff/coding/BulkUpload";
import StaffStudentProfile from './pages/staff/coding/StaffStudentProfile';
import StudentStats from './pages/staff/coding/studentstats';
import Mcq from './pages/staff/mcq/Mcq';
import Mcq_Assement from './pages/student/student_mcq/Mcq_Assement';
import Viewtest from './pages/staff/coding/Viewtest';
import StaffProfile from './pages/staff/Staffprofile';
import Mcq_Assesment from './pages/staff/mcq/Mcq_Assesment';
import Mcq_section from './pages/staff/mcq/Mcq_section';
import Mcq_questions from './components/staff/mcq/Mcq_questions';
import Mcq_createQuestion from './components/staff/mcq/Mcq_createQuestion';
import Mcq_bulkUpload from './components/staff/mcq/Mcq_bulkUpload';
import Mcq_Dashboard from './pages/staff/mcq/Mcq_Dashboard';




// Layout component for wrapping student routes 
const StudentLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Render nested routes */}
  </>
);


// Layout component for wrapping staff routes
const StaffLayout = () => (
  <>
    <StaffNavbar />
    <Outlet /> {/* Render nested routes */}
  </>
);

function App() {
  const [studentId, setStudentId] = useState(null);

  return (
    <Router>
      <Routes>
        {/* General Home */}
        <Route path="/" element={<GeneralHome />} />

        {/* Student Routes */}
        <Route path="/StudentRegister" element={<StudentRegister />} />
        <Route path="/StudentLogin" element={<StudentLogin onLogin={setStudentId} />} />
        <Route element={<StudentLayout />}>
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/studentprofile" element={<StudentProfile studentId={studentId} />} />
        </Route>
        <Route path="/testinstructions/:contestId" element={<TestInstructions />} />
        <Route path="/coding/:contestId" element={<ContestPage />} />
        <Route path="/mcq/:contestId" element={<Mcq_Assement />} />


        {/* Staff Routes */}
        <Route path="/stafflogin" element={<Login />} />
        <Route path="/staffsignup" element={<Signup />} />
        <Route element={<StaffLayout />}>
          <Route path="/staffdashboard" element={<Dashboard />} />
          <Route path="/staffprofile" element={<StaffProfile />} />
          <Route path="/library" element={<Library />} />
          <Route path="/coding/details" element={<Assesment />} /> {/* coding creation */}
          <Route path="/SelectTestOption" element={<SelectTestOption />} />
          <Route path="/staffstudentprofile" element={<StaffStudentProfile/>} />         
          <Route path="/:contestId/Questions" element={<Questions />} />
          <Route path="/:contestId/QuestionsLibrary" element={<QuestionsLibrary />} />          
          <Route path="/library/Mcq" element={<Mcq/>} />
          <Route path="/Questions/:contestId" element={<Questions />} />
          <Route path="/QuestionsLibrary/:contestId" element={<QuestionsLibrary />} />          
          <Route path="/studentstats/:regno" element={<StudentStats />} /> 
          <Route path="/viewcontest/:contestId" element={<ViewContest />} />
          <Route path="/:contestId/question-preview" element={<QuestionPreview />} />


          {/* <Route path="/coding" element={<ContestDashboard />} /> */}
          {/* <Route path="/FileUpload" element={<FileUpload />} /> */}
          {/* <Route path="/ManualSelectUI" element={<ManualSelectUI />} /> */}
          {/* <Route path="/HrUpload/:contestId" element={<HrUpload />} /> */}
          {/* <Route path="/OnebyOne" element={<OnebyOne />} /> */}
          {/* <Route path="/ManualPage/:contestId" element={<ManualPage />} /> */}
          {/* <Route path="/CreateContest" element={<CreateContest />} /> */}
          {/* <Route path="/StartContest" element={<StartContest />} /> */}
          

          <Route path="/library/coding" element={<QuestionDashboard />} />
          <Route path="/BulkUpload" element={<BulkUpload />} />
          <Route path="/viewtest/:contestId" element={<Viewtest />} />

          {/* MCQ - routes */}
          <Route path='mcq/details' element={<Mcq_Assesment />}/>
          <Route path='mcq/sectionDetails' element={<Mcq_section/>}/>
          <Route path='mcq/questions' element={<Mcq_questions/>}/>
          <Route path='mcq/CreateQuestion' element = {<Mcq_createQuestion/>}/>
          <Route path='mcq/bulkUpload' element={<Mcq_bulkUpload />}/>
          <Route path='mcq/QuestionsDashboard' element = {<Mcq_Dashboard/>}/>

        </Route>
       
        {/* <Route path="/assessment-overview" element={<AssessmentOverview />} />
        <Route path="/test-configuration" element={<TestConfiguration />} /> */}
        {/* <Route path='/UploadType' element = {<HomeTwo/>} />
        <Route path='/QuestionsDashboard' element = {<Dashboard/>}/>
        <Route path='/BulkUpload' element = {<Upload/>}/> */}

      </Routes>
    </Router>
  );
}

export default App;