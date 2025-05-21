import { useNavigate } from "react-router-dom";
import studentImage from "../assets/student-signup.jpg";
import employerImage from "../assets/employer-signup.jpg";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 text-white p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">REGISTRATION FOR INTERNSHIP</h1>
          <p className="text-lg">Join our platform to kickstart your career journey</p>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Student Card */}
          <div className="p-8 border-r border-gray-200 flex flex-col h-full">
            <div className="mb-6 h-80 w-full overflow-hidden rounded-lg flex-shrink-0"> 
              <img 
                src={studentImage} 
                alt="Student"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="flex-grow flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">I Am Student</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Find internships and kickstart your career with real-world experience
              </p>
              <button
                onClick={() => navigate("/signup/student")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition mt-auto"
              >
                REGISTER NOW
              </button>
            </div>
          </div>

          {/* Employer Card */}
          <div className="p-8 flex flex-col h-full">
            <div className="mb-6 h-80 w-full overflow-hidden rounded-lg flex-shrink-0"> {/* Increased to h-80 */}
              <img 
                src={employerImage} 
                alt="Employer"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            <div className="flex-grow flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">I Am Employer</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Discover talented interns and grow your organization
              </p>
              <button
                onClick={() => navigate("/signup/recruiter")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition mt-auto"
              >
                REGISTER NOW
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;