import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const ResumeSocialLinks = ({ data, setData, handleSubmit: parentHandleSubmit }) => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: data.social_links?.linkedin || "",
    github: data.social_links?.github || "",
    portfolio: data.social_links?.portfolio || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setData({ ...data, resume_link: file }); // Update parent state
      setError("");
    } else {
      setError("Only PDF files are allowed.");
    }
  };

  const handleInputChange = (e) => {
    const updatedLinks = { ...socialLinks, [e.target.name]: e.target.value };
    setSocialLinks(updatedLinks);
    setData({ ...data, social_links: updatedLinks }); // Update parent state
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!resume) {
      setError("Please upload your resume.");
      return;
    }
    
    if (!socialLinks.linkedin) {
      setError("LinkedIn URL is required.");
      return;
    }
    
    if (!socialLinks.github) {
      setError("GitHub URL is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Update parent component's state with resume and social links
      setData((prevData) => ({
        ...prevData,
        resume_link: resume,
        social_links: socialLinks,
      }));

      // Call the parent's handleSubmit function
      parentHandleSubmit();
    } catch (error) {
      console.error("Error submitting profile:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Resume & Social Links
        </h2>

        {/* Resume Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF) <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center transition-colors hover:border-blue-500">
            <label className="cursor-pointer flex flex-col items-center">
              <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Drag & drop or <span className="text-blue-500">click to upload</span>
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {resume && (
            <p className="text-sm text-green-600 mt-2">Selected: {resume.name}</p>
          )}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        {/* Social Links Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="linkedin"
              value={socialLinks.linkedin}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="https://linkedin.com/in/username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="github"
              value={socialLinks.github}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="https://github.com/username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio
            </label>
            <input
              type="url"
              name="portfolio"
              value={socialLinks.portfolio}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg mt-6 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {loading ? "Saving..." : "Save & Finish"}
        </button>
      </div>
    </div>
  );
};

export default ResumeSocialLinks;