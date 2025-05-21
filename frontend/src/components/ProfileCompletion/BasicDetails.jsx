import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Select from "react-select";
import { FaTimes } from "react-icons/fa";

// Skills Options
const skillsOptions = [

  { value: "Python", label: "Python" },
  { value: "Java", label: "Java" },
  { value: "C#", label: "C#" },
  { value: "C++", label: "C++" },
  { value: "Ruby", label: "Ruby" },
  { value: "Swift", label: "Swift" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "R", label: "R" },
  { value: "Dart", label: "Dart" },
  { value: "Scala", label: "Scala" },
  { value: "Perl", label: "Perl" },
  { value: "Lua", label: "Lua" },
  { value: "Haskell", label: "Haskell" },
  { value: "Elixir", label: "Elixir" },
  { value: "Clojure", label: "Clojure" },
  { value: "Shell", label: "Shell" },
  { value: "MATLAB", label: "MATLAB" },
  { value: "SQL", label: "SQL" },
  { value: "Assembly", label: "Assembly" },
  { value: "VB.NET", label: "VB.NET" },
  { value: "F#", label: "F#" },
  { value: "Objective-C", label: "Objective-C" },
  { value: "COBOL", label: "COBOL" },
  { value: "Fortran", label: "Fortran" },
  { value: "Groovy", label: "Groovy" },
  { value: "Erlang", label: "Erlang" },
  { value: "Ada", label: "Ada" },
  { value: "Prolog", label: "Prolog" },
  { value: "Julia", label: "Julia" },


  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Quantum Computing", label: "Quantum Computing" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "Data Science", label: "Data Science" },
  { value: "Networking", label: "Networking" },
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "Tailwind CSS", label: "Tailwind CSS" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "React", label: "React" },
  { value: "Next.js", label: "Next.js" },
  { value: "Three.js", label: "Three.js" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Angular", label: "Angular" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "PHP", label: "PHP" },
  { value: "Spring Boot", label: "Spring Boot" },
  { value: "Django", label: "Django" },
  { value: "Flask", label: "Flask" },
  { value: "Fast API", label: "Fast API" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "PL/SQL", label: "PL/SQL" },

  { value: "Git", label: "Git" },
  { value: "GitHub", label: "GitHub" },
  { value: "GitLab", label: "GitLab" },
  { value: "Bitbucket", label: "Bitbucket" },
  { value: "Jenkins", label: "Jenkins" },
  { value: "Travis CI", label: "Travis CI" },
  { value: "CircleCI", label: "CircleCI" },
  { value: "Azure DevOps", label: "Azure DevOps" },

  { value: "AWS", label: "AWS" },
  { value: "Azure", label: "Azure" },
  { value: "Google Cloud Platform", label: "Google Cloud Platform" },
  { value: "IBM Cloud", label: "IBM Cloud" },
  { value: "Heroku", label: "Heroku" },
  { value: "Netlify", label: "Netlify" },
  { value: "Vercel", label: "Vercel" },

  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "Helm", label: "Helm" },
  { value: "OpenShift", label: "OpenShift" },

  { value: "Hadoop", label: "Hadoop" },
  { value: "Spark", label: "Spark" },
  { value: "Kafka", label: "Kafka" },
  { value: "Power BI", label: "Power BI" },
  { value: "Tableau", label: "Tableau" },

  { value: "Selenium", label: "Selenium" },
  { value: "JUnit", label: "JUnit" },
  { value: "Cypress", label: "Cypress" },
  { value: "Postman", label: "Postman" },

  { value: "Wireshark", label: "Wireshark" },
  { value: "Metasploit", label: "Metasploit" },
  { value: "Burp Suite", label: "Burp Suite" },

  { value: "Circuit Design", label: "Circuit Design" },
  { value: "Embedded Systems", label: "Embedded Systems" },
  { value: "VLSI", label: "VLSI" },
  { value: "Microcontrollers", label: "Microcontrollers" },
  { value: "Digital Signal Processing", label: "Digital Signal Processing" },
  { value: "Power Electronics", label: "Power Electronics" },
  { value: "Control Systems", label: "Control Systems" },
  { value: "Internet of Things (IoT)", label: "Internet of Things (IoT)" },
  { value: "MATLAB", label: "MATLAB" },
  { value: "FPGA Programming", label: "FPGA Programming" },

  { value: "CAD/CAM", label: "CAD/CAM" },
  { value: "3D Modeling", label: "3D Modeling" },
  { value: "Thermodynamics", label: "Thermodynamics" },
  { value: "Fluid Mechanics", label: "Fluid Mechanics" },
  { value: "Automobile Engineering", label: "Automobile Engineering" },
  { value: "Mechatronics", label: "Mechatronics" },
  { value: "Manufacturing Processes", label: "Manufacturing Processes" },
  { value: "ANSYS", label: "ANSYS" },
  { value: "SolidWorks", label: "SolidWorks" },
  { value: "HVAC Systems", label: "HVAC Systems" },

  { value: "Structural Analysis", label: "Structural Analysis" },
  { value: "AutoCAD", label: "AutoCAD" },
  { value: "Building Information Modeling (BIM)", label: "Building Information Modeling (BIM)" },
  { value: "Geotechnical Engineering", label: "Geotechnical Engineering" },
  { value: "Transportation Engineering", label: "Transportation Engineering" },
  { value: "Construction Management", label: "Construction Management" },
  { value: "Water Resource Engineering", label: "Water Resource Engineering" },
  { value: "Surveying", label: "Surveying" },
  { value: "Revit", label: "Revit" },
  { value: "STAAD Pro", label: "STAAD Pro" },

  { value: "Process Design", label: "Process Design" },
  { value: "Petroleum Engineering", label: "Petroleum Engineering" },
  { value: "Heat Transfer", label: "Heat Transfer" },
  { value: "Polymer Technology", label: "Polymer Technology" },
  { value: "Industrial Safety", label: "Industrial Safety" },
  { value: "Reaction Engineering", label: "Reaction Engineering" },
  { value: "Biochemical Engineering", label: "Biochemical Engineering" },
  { value: "Environmental Engineering", label: "Environmental Engineering" },
  { value: "Material Science", label: "Material Science" },
  { value: "Process Simulation", label: "Process Simulation" },

  { value: "Genetic Engineering", label: "Genetic Engineering" },
  { value: "Molecular Biology", label: "Molecular Biology" },
  { value: "Biomedical Engineering", label: "Biomedical Engineering" },
  { value: "Bioinformatics", label: "Bioinformatics" },
  { value: "Pharmaceutical Technology", label: "Pharmaceutical Technology" },
  { value: "Bioprocess Engineering", label: "Bioprocess Engineering" },
  { value: "Nanotechnology", label: "Nanotechnology" },
  { value: "Cell Culture Techniques", label: "Cell Culture Techniques" },
  { value: "Neuroscience", label: "Neuroscience" },
  { value: "Proteomics", label: "Proteomics" },

  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Business Management", label: "Business Management" },
  { value: "Finance", label: "Finance" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
  { value: "Human Resources", label: "Human Resources" },

  { value: "Communication", label: "Communication" },
  { value: "Teamwork", label: "Teamwork" },
  { value: "Problem-Solving", label: "Problem-Solving" },
  { value: "Leadership", label: "Leadership" },
  { value: "Time Management", label: "Time Management" },
  { value: "Critical Thinking", label: "Critical Thinking" },
  { value: "Adaptability", label: "Adaptability" },
  { value: "Creativity", label: "Creativity" },
];

const BasicDetails = ({ data, setData, nextStep }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    location: "",
    about: "",
    college: "",
    department: "",
    registration_number: "",
    skills: [],
    profile_img: null,
  });

  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    console.log("Logged-in user:", user);

    const fetchUserDetails = async () => {
      try {
        if (!user?.student_id) {
          console.error("No student ID found.");
          return;
        }

        const apiUrl = `http://localhost:8000/user-details/${user.student_id}`;
        console.log("Fetching user details from:", apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("API response:", data);

        if (data.status === "success") {
          setFormData((prev) => ({
            ...prev,
            name: data.data.name || "",
            email: data.data.email || "",
          }));
        } else {
          console.error("Failed to fetch user details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_img: e.target.files[0] });
  };

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      skills: selectedOptions.map((skill) => skill.value),
    }));
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = selectedSkills.filter((skill) => skill.value !== skillToRemove.value);
    setSelectedSkills(updatedSkills);
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills.map((skill) => skill.value),
    }));
  };

  const handleNext = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.dob ||
      !formData.gender ||
      !formData.location ||
      !formData.about ||
      !formData.college ||
      !formData.department ||
      !formData.registration_number ||
      formData.skills.length === 0
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    setData(formData); // Ensure setData is called here
    nextStep();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <motion.div
        className="max-w-2xl w-full mx-auto p-8 bg-white rounded-lg text-gray-900 border border-gray-300"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-8 text-center text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Student Profile Completion
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* Name Field */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Email Field */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Phone Number */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Date of Birth */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Gender Selection */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["Male", "Female", "Other"].map((gender) => (
                <label key={gender} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:border-blue-500 outline-none"
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your location"
            />
          </div>

          {/* About Field */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              About <span className="text-red-500">*</span>
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          {/* College Name */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              College Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your college name"
            />
          </div>

          {/* Department */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your department"
            />
          </div>

          {/* Registration Number */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your registration number"
            />
          </div>

          {/* Skills Section */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Skills <span className="text-red-500">*</span>
            </label>
            <Select
              options={skillsOptions}
              isMulti
              value={selectedSkills}
              onChange={handleSkillChange}
              className="mb-4"
              placeholder="Start typing to select skills..."
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: "50px", // Match the height of the input field
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  display: "none",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  display: "none",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  display: "none",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  display: "none",
                }),
                multiValueRemove: (provided) => ({
                  ...provided,
                  display: "none",
                }),
              }}
              components={{
                MultiValueContainer: () => null,
              }}
            />
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill.value}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
                >
                  {skill.label}
                  <button type="button" onClick={() => handleRemoveSkill(skill)}>
                    <FaTimes className="text-white text-sm" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="w-3/4">
            <label className="block mb-2 font-semibold text-gray-700 text-left">
              Profile Image Upload
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L7 9m3-3 3 3"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, or JPEG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  name="profile_img"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end mt-8 w-3/4">
            <Button
              onClick={handleNext}
              className="bg-blue-500 px-8 py-3 rounded-lg text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Next
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BasicDetails;