import { useState } from "react";
import { FaTrashAlt, FaPlus } from "react-icons/fa";

const EducationDetails = ({ data, setData, nextStep, prevStep }) => {
  const [formData, setFormData] = useState({
    education: data.education || [{ degree: "", institution: "", year: "", grade: "" }], // Array of objects
  });

  const handleEducationChange = (index, e) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: updatedEducation });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", institution: "", year: "", grade: "" }],
    });
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updatedEducation });
  };

  const handleSaveAndContinue = () => {
    if (formData.education.length === 0) {
      alert("Please add at least one education entry.");
      return;
    }
  
    // Update parent component's state with education data
    setData((prevData) => ({
      ...prevData,
      education: formData.education, // Send education data as an array of objects
    }));
  
    // Move to the next step
    nextStep();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Education Details</h2>

        {/* Education Section */}
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Education History</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="border border-gray-300 bg-gray-50 p-5 rounded-lg mb-4 shadow-sm relative">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  placeholder="Degree"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  placeholder="Institution"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Year of Completion</label>
                <input
                  type="number"
                  name="year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  placeholder="Year of Completion"
                  min="1990"
                  max="2025"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={edu.grade}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-400 focus:ring-2 outline-none"
                  placeholder="Grade"
                />
              </div>
            </div>

            {/* Remove Education Button (Except First Field) */}
            {formData.education.length > 1 && index !== 0 && (
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
                className="absolute -top-4 right-2 text-red-600 hover:text-red-800 transition bg-white rounded-full p-2 shadow-md"
              >
                <FaTrashAlt className="text-lg" />
              </button>
            )}
          </div>
        ))}

        {/* Add More Education Button */}
        <button
          type="button"
          onClick={handleAddEducation}
          className="flex items-center justify-center gap-2 text-blue-600 font-semibold mt-3 hover:text-blue-800 transition"
        >
          <FaPlus /> Add More Education
        </button>

        {/* Save & Continue Button */}
        <button
          onClick={handleSaveAndContinue}
          className="w-full bg-blue-500 text-white p-3 rounded-lg mt-6 hover:bg-blue-600 transition"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default EducationDetails;