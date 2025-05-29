import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import AdminNavbar from "../components/AdminNavbar"; 
// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const AdminInternshipPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/admin/internships`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === "success") {
          setInternships(response.data.data);
        } else {
          setError("Failed to fetch internships.");
        }
      } catch (err) {
        setError("Failed to fetch internships. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Handle delete internship
  const handleDelete = async (internshipId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/admin/internship/${internshipId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "success") {
        setInternships((prev) => prev.filter((internship) => internship._id !== internshipId));
        setDeleteDialogOpen(false);
      } else {
        setError("Failed to delete internship.");
      }
    } catch (err) {
      setError("Failed to delete internship. Please try again.");
    }
  };

  // Handle update internship status
  const handleUpdateStatus = async (internshipId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/admin/internship/${internshipId}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === "success") {
        setInternships((prev) =>
          prev.map((internship) =>
            internship._id === internshipId
              ? { ...internship, internship_status: status }
              : internship
          )
        );
        setStatusDialogOpen(false);
      } else {
        setError("Failed to update internship status.");
      }
    } catch (err) {
      setError("Failed to update internship status. Please try again.");
    }
  };

  // Filter internships based on search query
  const filteredInternships = internships.filter((internship) => {
    const combinedFields = `${internship.title} ${internship.company_name} ${internship.internship_domain} ${internship.type_of_internship} ${internship.internship_status} ${internship.application_deadline}`.toLowerCase();
    return combinedFields.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ animation: `${pulse} 1.5s infinite` }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ animation: `${fadeIn} 0.5s ease-in` }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      <AdminNavbar /> {/* Include the Navbar */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "16px",
            background: "linear-gradient(145deg, #f3f4f6, #ffffff)",
            animation: `${fadeIn} 0.8s ease-in`,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
            Admin Internship Management
          </Typography>

          {/* Search Box */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, domain, type, status, or deadline..."
              InputProps={{
                startAdornment: <SearchIcon style={{ marginRight: 8, color: "#9CA3AF" }} />,
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Domain</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Application Deadline</TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInternships.map((internship) => (
                  <TableRow key={internship._id} hover>
                    <TableCell>{internship.title}</TableCell>
                    <TableCell>{internship.company_name}</TableCell>
                    <TableCell>{internship.internship_domain || "N/A"}</TableCell>
                    <TableCell>{internship.type_of_internship || "N/A"}</TableCell>
                    <TableCell>{internship.internship_status}</TableCell>
                    <TableCell>{internship.application_deadline}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedInternship(internship);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedInternship(internship);
                          setStatusDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Internship</DialogTitle>
            <DialogContent>
              Are you sure you want to delete the internship titled{" "}
              <strong>{selectedInternship?.title}</strong>?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                color="error"
                onClick={() => handleDelete(selectedInternship?._id)}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Update Status Dialog */}
          <Dialog
            open={statusDialogOpen}
            onClose={() => setStatusDialogOpen(false)}
          >
            <DialogTitle>Update Internship Status</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Update the status of the internship titled{" "}
                <strong>{selectedInternship?.title}</strong>:
              </Typography>
              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateStatus(selectedInternship?._id, "inactive")}
                >
                  Set Inactive
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminInternshipPage;