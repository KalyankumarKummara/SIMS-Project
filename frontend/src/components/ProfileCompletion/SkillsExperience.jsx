import { useState } from "react";
import { FaTrashAlt, FaPlus } from "react-icons/fa";

const SkillsExperience = ({ data, setData, nextStep }) => {
  const [experience, setExperience] = useState([{ company: "", role: "", duration: "", description: "" }]);
  const [certifications, setCertifications] = useState([{ name: "", issuedBy: "", year: "", link: "" }]);
  const [projects, setProjects] = useState([{ name: "", description: "", techStack: "", github: "" }]);

  const handleAddExperience = () => {
    setExperience([...experience, { company: "", role: "", duration: "", description: "" }]);
  };

  const handleAddCertification = () => {
    setCertifications([...certifications, { name: "", issuedBy: "", year: "", link: "" }]);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: "", description: "", techStack: "", github: "" }]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
  };

  const handleRemoveCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleSubmit = () => {
    // Update parent component's state with experience, certifications, and projects
    setData((prevData) => ({
      ...prevData,
      experience,
      certifications,
      projects,
    }));

    // Move to the next step
    nextStep();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-3xl w-full mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile Completion</h2>

        {/* Projects Section */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Projects</h3>
          {projects.map((project, index) => (
            <div key={index} className="border border-gray-300 bg-gray-50 p-5 rounded-lg mb-4 shadow-sm relative">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    placeholder="Project Name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    placeholder="Tech Stack"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">GitHub Link</label>
                  <input
                    type="text"
                    placeholder="GitHub Link"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="absolute -top-4 right-2 text-red-600 hover:text-red-800 transition bg-white rounded-full p-2 shadow-md"
                >
                  <FaTrashAlt className="text-lg" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddProject}
            className="flex items-center justify-center gap-2 text-blue-600 font-semibold mt-3 hover:text-blue-800 transition"
          >
            <FaPlus /> Add More Projects
          </button>
        </div>

        {/* Certifications Section */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Certifications</h3>
          {certifications.map((cert, index) => (
            <div key={index} className="border border-gray-300 bg-gray-50 p-5 rounded-lg mb-4 shadow-sm relative">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Certification Name</label>
                  <input
                    type="text"
                    placeholder="Certification Name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Issued By</label>
                  <input
                    type="text"
                    placeholder="Issued By"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    placeholder="Year"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Certification Link</label>
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCertification(index)}
                  className="absolute -top-4 right-2 text-red-600 hover:text-red-800 transition bg-white rounded-full p-2 shadow-md"
                >
                  <FaTrashAlt className="text-lg" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddCertification}
            className="flex items-center justify-center gap-2 text-blue-600 font-semibold mt-3 hover:text-blue-800 transition"
          >
            <FaPlus /> Add More Certifications
          </button>
        </div>

        {/* Experience Section */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="border border-gray-300 bg-gray-50 p-5 rounded-lg mb-4 shadow-sm relative">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="Company"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    placeholder="Role"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="Duration"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="absolute -top-4 right-2 text-red-600 hover:text-red-800 transition bg-white rounded-full p-2 shadow-md"
                >
                  <FaTrashAlt className="text-lg" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddExperience}
            className="flex items-center justify-center gap-2 text-blue-600 font-semibold mt-3 hover:text-blue-800 transition"
          >
            <FaPlus /> Add More Experience
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default SkillsExperience;