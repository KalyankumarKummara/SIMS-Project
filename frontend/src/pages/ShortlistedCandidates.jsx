import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyNavbar from "../components/CompanyNavbar";
import Footer from "../components/Companyfooter";
import API_BASE_URL from "../config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";

const ShortlistedCandidates = () => {
  const navigate = useNavigate();
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Typing effect for search box placeholder
  const [placeholderText, setPlaceholderText] = useState("");
  const placeholderOptions = [
    "Search by name...",
    "Search by email...",
    "Search by gender...",
    "Search by DOB...",
    "Search by internship name...",
  ];

  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentPlaceholder = placeholderOptions[currentIndex];

      if (isDeleting) {
        currentText = currentPlaceholder.substring(0, currentText.length - 1);
      } else {
        currentText = currentPlaceholder.substring(0, currentText.length + 1);
      }

      setPlaceholderText(currentText);

      if (!isDeleting && currentText === currentPlaceholder) {
        setTimeout(() => (isDeleting = true), 1000);
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % placeholderOptions.length;
      }

      setTimeout(type, typingSpeed);
    };

    type();
  }, []);

  // Fetch shortlisted candidates
  useEffect(() => {
    fetchShortlistedCandidates();
  }, []);

  const fetchShortlistedCandidates = async () => {
    try {
      const companyId = localStorage.getItem("company_id");
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shortlisted candidates");
      }

      const data = await response.json();
      const candidatesWithInternshipNames = await Promise.all(
        data.data.shortlisted.map(async (candidate) => {
          const internshipResponse = await fetch(
            `${API_BASE_URL}/internships/${candidate.internship_id}`
          );
          const internshipData = await internshipResponse.json();
          return {
            ...candidate,
            internship_name: internshipData.data.title || "N/A",
          };
        })
      );
      setShortlistedCandidates(candidatesWithInternshipNames);
    } catch (error) {
      console.error("Error fetching shortlisted candidates:", error);
      setShortlistedCandidates([]);
    }
  };

  // Filter candidates based on search query
  const filteredCandidates = shortlistedCandidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    return (
      candidate.full_name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.gender.toLowerCase().includes(query) ||
      candidate.dob.toLowerCase().includes(query) ||
      candidate.internship_name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <CompanyNavbar pageTitle="Shortlisted Candidates" />
      <div className="flex-grow p-6 pb-12">
        {/* Page Title */}
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom sx={{ textAlign: "center" }}>
          Shortlisted Candidates
        </Typography>

        {/* Search Box */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholderText}
              className="w-full px-6 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all shadow-lg"
            />
            <FaSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
          </div>
        </div>

        {/* Table */}
        {filteredCandidates.length === 0 ? (
          <Typography variant="body1" className="text-gray-500" sx={{textAlign:"center"}}>
            No Candidates has been Shortlisted or no candidates match the search criteria.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto", marginBottom: 4 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Gender
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    DOB
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Internship Name
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate._id} hover sx={{ '&:hover': { backgroundColor: "#e0f7fa" } }}>
                    <TableCell>{candidate.full_name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>{candidate.gender}</TableCell>
                    <TableCell>{candidate.dob}</TableCell>
                    <TableCell>{candidate.internship_name}</TableCell>
                    <TableCell>{candidate.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/internships/${candidate.internship_id}/applications/${candidate._id}`)} // Navigate with internship_id and application_id
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShortlistedCandidates;