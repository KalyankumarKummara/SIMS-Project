import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Modal from "../components/Modal";
import CompanyNavbar from "../components/CompanyNavbar";
import Footer from "../components/Companyfooter";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";

const ManageInternshipsPage = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInternshipId, setSelectedInternshipId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of internships per page

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Dynamic placeholder text for search box
    const [placeholderText, setPlaceholderText] = useState("");
    const placeholderOptions = [
        "Search by title...",
        "Search by domain...",
        "Search by type...",
        "Search by location...",
        "Search by duration...",
        "Search by status...",
    ];

    // Typing effect for placeholder
    useEffect(() => {
        let currentIndex = 0;
        let currentText = "";
        let isDeleting = false;
        let typingSpeed = 100; // Speed of typing (in milliseconds)

        const type = () => {
            const currentPlaceholder = placeholderOptions[currentIndex];

            if (isDeleting) {
                // Erase text
                currentText = currentPlaceholder.substring(0, currentText.length - 1);
            } else {
                // Add text
                currentText = currentPlaceholder.substring(0, currentText.length + 1);
            }

            setPlaceholderText(currentText);

            if (!isDeleting && currentText === currentPlaceholder) {
                // Pause at the end of typing
                setTimeout(() => (isDeleting = true), 1000);
            } else if (isDeleting && currentText === "") {
                // Move to the next placeholder
                isDeleting = false;
                currentIndex = (currentIndex + 1) % placeholderOptions.length;
            }

            setTimeout(type, typingSpeed);
        };

        type();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("company_id");

        if (!token || !companyId) {
            navigate("/login");
            return;
        }

        // Fetch posted internships
        fetch(`${API_BASE_URL}/internships/company/${companyId}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setInternships(data);
                } else {
                    setError("Failed to fetch internships");
                }
            })
            .catch((error) => {
                console.error("Error fetching internships:", error);
                setError("Failed to fetch internships");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    // Function to handle editing an internship
    const handleEdit = (internshipId) => {
        console.log("Edit internship:", internshipId);
        navigate(`/internship/edit/${internshipId}`);
    };

    // Function to handle deleting an internship
    const handleDelete = (internshipId) => {
        setSelectedInternshipId(internshipId);
        setIsModalOpen(true);
    };

    // Function to confirm deletion
    const confirmDelete = () => {
        if (selectedInternshipId) {
            fetch(`${API_BASE_URL}/internships/${selectedInternshipId}`, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        // Remove the deleted internship from the list
                        setInternships((prev) =>
                            prev.filter((internship) => internship.internship_id !== selectedInternshipId)
                        );
                    } else {
                        console.error("Failed to delete internship:", data.message);
                    }
                })
                .catch((error) => console.error("Error deleting internship:", error))
                .finally(() => {
                    setIsModalOpen(false);
                    setSelectedInternshipId(null);
                });
        }
    };

    // Filter internships based on search query across multiple fields
    const filteredInternships = internships.filter((internship) => {
        const combinedFields = `${internship.title} ${internship.internship_domain} ${internship.type_of_internship} ${internship.location} ${internship.internship_status} ${internship.duration}`.toLowerCase();
        return combinedFields.includes(searchQuery.toLowerCase());
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInternships = filteredInternships.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar with page title */}
            <CompanyNavbar pageTitle="Manage Internship" />

            {/* Main Content */}
            <div className="flex-grow p-6">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
                        Manage Internships
                    </h1>

                    {/* Search Box */}
                    <div className="flex justify-center mb-12">
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

                    
                    <div className="mt-8">
                        {error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : filteredInternships.length > 0 ? (
                            <>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Title</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Domain</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Type</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Location</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Duration</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Open Positions</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Deadline</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Status</TableCell>
                                                <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold", backgroundColor: "#3b82f6", color: "white" }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentInternships.map((internship) => (
                                                <TableRow key={internship.internship_id}>
                                                    <TableCell>{internship.title}</TableCell>
                                                    <TableCell>{internship.internship_domain}</TableCell>
                                                    <TableCell>{internship.type_of_internship}</TableCell>
                                                    <TableCell>{internship.location}</TableCell>
                                                    <TableCell>{internship.duration}</TableCell>
                                                    <TableCell>{internship.open_positions}</TableCell>
                                                    <TableCell>
                                                        {new Date(internship.application_deadline).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-sm font-semibold ${internship.internship_status === "Active"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {internship.internship_status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(internship.internship_id)}
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(internship.internship_id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* Pagination Controls */}
                                <div className="flex justify-center mt-6">
                                    {Array.from({ length: Math.ceil(filteredInternships.length / itemsPerPage) }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`mx-1 px-4 py-2 rounded ${currentPage === i + 1
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-500">
                                No internships found.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Modal for Delete Confirmation */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Internship"
                message="Are you sure you want to delete this internship? This action cannot be undone."
            />
        </div>
    );
};

export default ManageInternshipsPage;