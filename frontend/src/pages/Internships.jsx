import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import CompanyNavbar from "../components/CompanyNavbar";
import Footer from "../components/Companyfooter";
import API_BASE_URL from "../config";

const InternshipForm = () => {
  const navigate = useNavigate();
  const companyId = localStorage.getItem("company_id");
  const [profileComplete, setProfileComplete] = useState(null);

  const [formData, setFormData] = useState({
    company_id: companyId || "",
    company_name: "",
    title: "",
    type_of_internship: "",
    description: "",
    required_skills: [],
    location: "",
    duration: "",
    mode_of_internship: "",
    open_positions: "",
    application_deadline: "",
    created_date: new Date().toISOString().split("T")[0],
    benefits: [],
    application_process: "",
    stipend_type: "",
    stipend_min: "",
    stipend_max: "",
    internship_status: "Active",
    contact_email: "",
    internship_domain: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        if (!companyId) {
          console.error("Company ID is undefined");
          setProfileComplete(false);
          return;
        }

        const apiUrl = `${API_BASE_URL}/company-profile/${companyId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          setProfileComplete(false);
          return;
        }

        const data = await response.json();

        if (data && data.status === "success") {
          setFormData((prev) => ({
            ...prev,
            company_id: data.data.company_id,
            company_name: data.data.name,
            location: data.data.location,
            contact_email: data.data.email,
          }));

          // Check required profile fields
          const requiredFields = ['name', 'location', 'email'];
          const isComplete = requiredFields.every(
            field => data.data[field] && data.data[field].trim() !== ''
          );
          setProfileComplete(isComplete);
        } else {
          console.error("Failed to fetch company profile: Invalid response");
          setProfileComplete(false);
        }
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
        setProfileComplete(false);
      }
    };

    fetchCompanyProfile();
  }, [companyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleSelectChange = (selectedOption, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "type_of_internship",
      "description",
      "required_skills",
      "duration",
      "mode_of_internship",
      "open_positions",
      "application_deadline",
      "internship_domain",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill out the required field: ${field}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        open_positions: parseInt(formData.open_positions, 10),
        stipend_min: formData.stipend_type === "Unpaid" ? 0 : parseFloat(formData.stipend_min),
        stipend_max: formData.stipend_type === "Unpaid" ? 0 : parseFloat(formData.stipend_max),
      };

      console.log("Payload being sent to the backend:", payload);

      const response = await fetch(`${API_BASE_URL}/internships/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to create internship: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 3000);
      } else {
        console.error("Failed to create internship:", data.message);
        alert("Failed to create internship. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Options for dropdowns
  const domainOptions = [
    { value: "Software", label: "Software" },
    { value: "Hardware", label: "Hardware" },
    { value: "Electrical", label: "Electrical" },
    { value: "Electronics & Communication", label: "Electronics & Communication" },
    { value: "Mechanical", label: "Mechanical" },
    { value: "Civil", label: "Civil" },
    { value: "Chemical", label: "Chemical" },
    { value: "Biotechnology", label: "Biotechnology" },
    { value: "Automobile", label: "Automobile" },
    { value: "Medical & Biomedical", label: "Medical & Biomedical" },
    { value: "Data Science & AI", label: "Data Science & AI" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Web Development", label: "Web Development" },
    { value: "App Development", label: "App Development" },
    { value: "Finance & Business", label: "Finance & Business" },
    { value: "Marketing & Sales", label: "Marketing & Sales" },
    { value: "Quantum Computing", label: "Quantum Computing" },
  ];

  const durationOptions = [
    { value: "1 Month", label: "1 Month" },
    { value: "2 Months", label: "2 Months" },
    { value: "3 Months", label: "3 Months" },
    { value: "6 Months", label: "6 Months" },
    { value: "9 Months", label: "9 Months" },
    { value: "10 Months", label: "10 Months" },
    { value: "12 Months", label: "12 Months" },
  ];

  const modeOptions = [
    { value: "Remote", label: "Remote" },
    { value: "On-site", label: "On-site" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  const stipendOptions = [
    { value: "Fixed", label: "Fixed" },
    { value: "Performance-based", label: "Performance-based" },
    { value: "Unpaid", label: "Unpaid" },
  ];

  const benefitsOptions = [
    { value: "Letter of Recommendation", label: "Letter of Recommendation" },
    { value: "Certificate", label: "Certificate" },
    { value: "Networking Opportunities", label: "Networking Opportunities" },
  ];

  const requiredSkillsOptions = [
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

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #d1d5db",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "#3b82f6",
        color: "white",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Conditionally render the Navbar */}
      {!isSuccess && <CompanyNavbar pageTitle="Post Internship" />}

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center min-h-screen mt-4">
        {/* Form Container */}
        <motion.div
          className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg text-gray-900 border border-gray-300 shadow-xl mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Loading State */}
          {profileComplete === null && (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying company profile...</p>
            </div>
          )}

          {/* Success Message */}
          {isSuccess ? (
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4 transition-opacity duration-1000">
                ✅
              </div>
              <p className="text-xl font-semibold text-gray-800">Internship Posted Successfully!</p>
            </div>
          ) : profileComplete === false ? (
            // Profile Incomplete Message
            <div className="text-center p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Complete Your Company Profile
              </h3>
              <p className="text-gray-600 mb-6">
                You must complete your company profile before posting internships.
              </p>
              <Button
                onClick={() => navigate("/recruiter/profile/company")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Complete Your Profile
              </Button>
            </div>
          ) : (
            <>
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold text-gray-800">Post Internship</h2>
                <p className="text-lg mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Help students find opportunities that shape their future.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Information */}
                <div className="border border-gray-300 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">1. Basic Information</h3>
                  <div className="space-y-4">
                    {/* Company ID */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Company ID</label>
                      <input
                        type="text"
                        name="company_id"
                        value={formData.company_id}
                        readOnly
                        className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Company Name</label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        readOnly
                        className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                      />
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email}
                        readOnly
                        className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        readOnly
                        className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Internship Details */}
                <div className="border border-gray-300 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">2. Internship Details</h3>
                  <div className="space-y-4">
                    {/* Title of Internship */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Title of Internship <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900"
                        placeholder="Enter internship title"
                        required
                      />
                    </div>

                    {/* Internship Domain */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Internship Domain <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={domainOptions}
                        value={domainOptions.find((option) => option.value === formData.internship_domain)}
                        onChange={(selectedOption) => handleSingleSelectChange(selectedOption, "internship_domain")}
                        className="w-full"
                        classNamePrefix="select"
                        styles={customStyles}
                        isClearable={false}
                        required
                      />
                    </div>

                    {/* Type of Internship */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Type of Internship <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={[
                          { value: "Full-time", label: "Full-time" },
                          { value: "Part-time", label: "Part-time" },
                        ]}
                        value={{ value: formData.type_of_internship, label: formData.type_of_internship }}
                        onChange={(selectedOption) => handleSingleSelectChange(selectedOption, "type_of_internship")}
                        className="w-full"
                        classNamePrefix="select"
                        styles={customStyles}
                        isClearable={false}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900"
                        rows={4}
                        placeholder="Describe the internship role and responsibilities"
                        required
                      />
                    </div>

                    {/* Required Skills */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Required Skills <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={requiredSkillsOptions}
                        value={requiredSkillsOptions.filter((option) =>
                          formData.required_skills.includes(option.value)
                        )}
                        onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "required_skills")}
                        className="w-full"
                        classNamePrefix="select"
                        styles={customStyles}
                        isMulti
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Internship Details */}
                <div className="border border-gray-300 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">3. Internship Details</h3>
                  <div className="space-y-4">
                    {/* Duration */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={durationOptions}
                        value={durationOptions.find((option) => option.value === formData.duration)}
                        onChange={(selectedOption) => handleSingleSelectChange(selectedOption, "duration")}
                        className="w-full"
                        classNamePrefix="select"
                        styles={customStyles}
                        isClearable={false}
                        required
                      />
                    </div>

                    {/* Mode of Internship */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Mode of Internship <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={modeOptions}
                        value={modeOptions.find((option) => option.value === formData.mode_of_internship)}
                        onChange={(selectedOption) => handleSingleSelectChange(selectedOption, "mode_of_internship")}
                        className="w-full"
                        classNamePrefix="select"
                        styles={customStyles}
                        isClearable={false}
                        required
                      />
                    </div>

                    {/* Open Positions */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Open Positions <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="open_positions"
                        value={formData.open_positions}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900"
                        placeholder="Enter number of open positions"
                        required
                      />
                    </div>

                    {/* Application Deadline */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">
                        Application Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="application_deadline"
                        value={formData.application_deadline}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Benefits and Process */}
                <div className="border border-gray-300 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">4. Benefits and Process</h3>
                  <div className="space-y-4">
                    {/* Benefits */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Benefits</label>
                      <Select
                        options={benefitsOptions}
                        value={benefitsOptions.filter((option) =>
                          formData.benefits.includes(option.value)
                        )}
                        onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "benefits")}
                        className="w-full"
                        classNamePrefix="select"
                        styles={customStyles}
                        isMulti
                      />
                    </div>

                    {/* Application Process */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Application Process</label>
                      <textarea
                        name="application_process"
                        value={formData.application_process}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900"
                        rows={4}
                        placeholder="Describe the application process"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Stipend Details */}
                <div className="border border-gray-300 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">5. Stipend Details</h3>
                  <div className="space-y-4">
                    {/* Stipend Type */}
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Stipend Type</label>
                      <Select
                        options={stipendOptions}
                        value={stipendOptions.find((option) => option.value === formData.stipend_type)}
                        onChange={(selectedOption) => handleSingleSelectChange(selectedOption, "stipend_type")}
                        className="w-full"
                        classNamePrefix="select"
                        styles={customStyles}
                        isClearable={false}
                      />
                    </div>

                    {/* Stipend Minimum */}
                    {formData.stipend_type !== "Unpaid" && (
                      <div>
                        <label className="block mb-2 font-semibold text-gray-700">Stipend Minimum (Optional)</label>
                        <input
                          type="number"
                          name="stipend_min"
                          value={formData.stipend_min}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900"
                          placeholder="Enter minimum stipend"
                        />
                      </div>
                    )}

                    {/* Stipend Maximum */}
                    {formData.stipend_type !== "Unpaid" && (
                      <div>
                        <label className="block mb-2 font-semibold text-gray-700">Stipend Maximum (Optional)</label>
                        <input
                          type="number"
                          name="stipend_max"
                          value={formData.stipend_max}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900"
                          placeholder="Enter maximum stipend"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                  <Button
                    type="submit"
                    className="bg-blue-500 px-8 py-3 rounded-lg text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Conditionally render the Footer */}
      {!isSuccess && <Footer />}
    </div>
  );
};

export default InternshipForm;