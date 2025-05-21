import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaSearch } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Card,
    Typography,
    Modal,
    Box,
    Button,
    Container,
    Grid,
    Link,
} from "@mui/material";
import StudentDashboardNavbar from "../components/StudentNavbar";
import Footer from "../components/Studentfooter"


const AppliedInternships = () => {
    const navigate = useNavigate();
    const [appliedInternships, setAppliedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Dynamic placeholder text for search box
    const [placeholderText, setPlaceholderText] = useState("");
    const placeholderOptions = [
        "Search by company name...",
        "Search by title...",
        "Search by domain...",
        "Search by type...",
        "Search by location...",
        "Search by duration...",
        "Search by status...",
    ];

    useEffect(() => {
        let currentIndex = 0;
        let currentText = "";
        let isDeleting = false;
        let typingSpeed = 100;

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

    const studentId = localStorage.getItem("student_id");

    // Fetch applied internships
    useEffect(() => {
        const fetchAppliedInternships = async () => {
            try {
                const response = await fetch(`http://localhost:8000/students/${studentId}/applied-internships`);
                const data = await response.json();

                if (data.status === "success") {
                    setAppliedInternships(data.data);
                } else if (data.status === "no_data") {
                    setAppliedInternships([]); // No data found, set appliedInternships to an empty array
                } else {
                    setError(data.message); // Handle other errors
                }
            } catch (err) {
                setError("Failed to fetch applied internships");
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedInternships();
    }, [studentId]);

    // Handle delete application
    const handleDeleteApplication = async (applicationId) => {
        setSelectedApplicationId(applicationId);
        setIsModalOpen(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (selectedApplicationId) {
            try {
                const response = await fetch(
                    `http://localhost:8000/applications/${selectedApplicationId}/student/${studentId}`,
                    {
                        method: "DELETE",
                    }
                );
                const data = await response.json();

                if (data.status === "success") {
                    // Remove the deleted application from the list
                    setAppliedInternships((prev) =>
                        prev.filter((app) => app.application_id !== selectedApplicationId)
                    );
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Failed to delete application");
            } finally {
                setIsModalOpen(false);
                setSelectedApplicationId(null);
            }
        }
    };

    // Filter applied internships based on search query
    const filteredInternships = appliedInternships.filter((internship) => {
        const combinedFields = `${internship.company_name} ${internship.title} ${internship.domain} ${internship.type} ${internship.location} ${internship.duration} ${internship.status}`.toLowerCase();
        return combinedFields.includes(searchQuery.toLowerCase());
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInternships = filteredInternships.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
                <Card className="p-6 shadow-lg">
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-purple-50">
            {/* Navbar */}
            <StudentDashboardNavbar pageTitle="Applied Internships" />

            {/* Main Content */}
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                {/* Centered Title */}
                <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                        Applied Internships
                    </h1>
                </Box>

                {/* Search Box */}
                <div className="flex justify-center mb-6">
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

                {/* Applied Internships Table */}
                <Card className="p-6 rounded-xl shadow-lg">
                    {filteredInternships.length > 0 ? (
                        <>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Company Name</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Title</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Domain</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Type</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Location</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Duration</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Applied Date</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Status</TableCell>
                                            <TableCell sx={{ borderBottom: "2px solid #3b82f6", fontWeight: "bold",color:"white", backgroundColor: "#3b82f6" }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentInternships.map((internship) => (
                                            <TableRow key={internship.application_id}>
                                                <TableCell>{internship.company_name}</TableCell>
                                                <TableCell>{internship.title}</TableCell>
                                                <TableCell>{internship.domain}</TableCell>
                                                <TableCell>{internship.type}</TableCell>
                                                <TableCell>{internship.location}</TableCell>
                                                <TableCell>{internship.duration}</TableCell>
                                                <TableCell>{new Date(internship.applied_date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={internship.status}
                                                        sx={{
                                                            backgroundColor:
                                                                internship.status === "pending"
                                                                    ? "orange"
                                                                    : internship.status === "shortlisted"
                                                                        ? "skyblue"
                                                                        : internship.status === "rejected"
                                                                            ? "red"
                                                                            : internship.status === "accepted"
                                                                                ? "green"
                                                                                : "default",
                                                            color: "white",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FaTrash
                                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                                        onClick={() => handleDeleteApplication(internship.application_id)}
                                                    />
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
                        <Typography variant="body1" className="text-center text-gray-500">
                            No internships found.
                        </Typography>
                    )}
                </Card>

                {/* Modal for Delete Confirmation */}
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="delete-confirmation-modal"
                    aria-describedby="delete-confirmation-modal-description"
                >
                    <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
                        <Typography variant="h6" id="delete-confirmation-modal" className="font-bold mb-4">
                            Delete Application
                        </Typography>
                        <Typography variant="body1" id="delete-confirmation-modal-description" className="mb-4">
                            Are you sure you want to delete this application? This action cannot be undone.
                        </Typography>
                        <Box className="flex justify-end space-x-4">
                            <Button
                                variant="outlined"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </div>

            <Footer></Footer>
        </div>
    );
};

export default AppliedInternships;