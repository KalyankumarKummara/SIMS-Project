import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const RoleSelection = lazy(() => import("./components/RoleSelection"))
const Signup = lazy(() => import("./pages/Signup"));
const AdminDashboard = lazy(() => import("./pages/admin-dashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const StudentProfileCompletion = lazy(() => import("./components/ProfileCompletion/StudentProfileCompletion"));
const CompanyProfileForm = lazy(() => import("./components/CompanyProfile/CompanyProfileForm"));
const InternshipCreation = lazy(() => import("./pages/Internships"));
const EditInternship = lazy(() => import("./pages/EditInternship"))
const InternshipList = lazy(() => import("./pages/InternshipListing"))
const InternshipDetails = lazy(() => import("./pages/InternshipDetails"))
const ApplyInternship = lazy(() => import("./pages/ApplyInternship"))
const Notifications = lazy(() => import("./pages/Notification"))
const ApplicationList = lazy(() => import("./pages/ApplicationList"))
const UpdateApplicationStatus = lazy(() =>import("./pages/UpdateApplicationStatus"))
const StudentProfile = lazy(() => import("./pages/StudentProfile"))
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"))
const AdminCrud = lazy(() => import("./pages/AdminCrud"))
const AdminInternshipCrud = lazy(() => import("./pages/AdminInternshipCrud"))
const SavedInternships = lazy(() => import("./pages/SavedInternships"))
const AppliedInternships = lazy(() => import("./pages/AppliedInternships"))
const ManageInternships = lazy(() => import("./pages/ManageInternships"))
const ShortlistedCandidates = lazy(() => import("./pages/ShortlistedCandidates"))
const AcceptedCandidates = lazy(() => import("./pages/AcceptedCandidates"))
const LandingPage = lazy(() => import("./pages/LandingPage"))
function App() {
  return ( 
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12"></div>
        </div>
      }
    >
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/internship/post" element={<InternshipCreation />} />
          <Route path="/student/profile" element={<StudentProfileCompletion />} />
          <Route path="/recruiter/profile/company" element={<CompanyProfileForm />} />
          <Route path="/internship/edit/:internshipId" element={<EditInternship />} />
          <Route path="/internship/details/:internshipId" element={<InternshipDetails />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="/internship/internship-list"element={<InternshipList />}/>
          <Route path="/apply/:internshipId" element={<ApplyInternship />} />
          <Route path="/notifications" element={<Notifications />}/>
          <Route path="/internships/:internship_id/applications/:application_id?" element={<ApplicationList />} />
          <Route path="/applications/:applicationId/update-status" element={<UpdateApplicationStatus />}/>
          <Route path="/student-profile/:student_id" element={<StudentProfile />} />
          <Route path="/company-profile/:company_id" element={<CompanyProfile />} />
          <Route path="/admin/crud" element={<AdminCrud />} />
          <Route path="/admin/manage-internship" element={<AdminInternshipCrud />}/>
          <Route path="/saved-internships" element={<SavedInternships />} />
          <Route path="/applied-internships" element={<AppliedInternships />} />
          <Route path="/manage-internships" element={<ManageInternships />} />
          <Route path="/recruiter/shortlisted-candidates" element={<ShortlistedCandidates />} />
          <Route path="/recruiter/accepted-candidates" element={<AcceptedCandidates />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;