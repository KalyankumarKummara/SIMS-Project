import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch, FaCheck } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar"; 

const AdminCRUD = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [updatedUsers, setUpdatedUsers] = useState({}); // Track updated users

  const placeholders = [
    "Search by name...",
    "Search by email...",
    "Search by role...",
    "Search by status...",
  ];

  useEffect(() => {
    let interval;
    if (!isTyping) {
      interval = setInterval(() => {
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < placeholders[placeholderIndex].length) {
        currentText += placeholders[placeholderIndex][currentIndex];
        setPlaceholder(currentText);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, [placeholderIndex]);

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersWithDefaultStatus = response.data.data.map((user) => ({
        ...user,
        status: user.status || "not approved",
      }));

      setUsers(usersWithDefaultStatus);
      setFilteredUsers(usersWithDefaultStatus);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      if (!searchTerm) {
        setFilteredUsers(users);
        return;
      }

      const filtered = users.filter((user) => {
        const name = user.name || "";
        const email = user.email || "";
        const role = user.role || "";
        const status = user.status || "";

        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      setFilteredUsers(filtered || []);
    };

    filterUsers();
  }, [searchTerm, users]);

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/admin/user/${userId}?status=approved`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        setUpdatedUsers((prev) => ({ ...prev, [userId]: true }));
        fetchUsers();
        toast.success("User approved successfully");
      } else {
        toast.error("Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8000/admin/user/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchUsers(); // Refresh the user list
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsModalOpen(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsTyping(true);

    if (window.typingTimeout) {
      clearTimeout(window.typingTimeout);
    }

    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <AdminNavbar /> {/* Include the Navbar */}
      <div className="p-8">
        <Toaster />
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Manage Users
        </h1>

        {/* Search Box */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
                <p className="text-sm text-gray-500">Status: {user.status}</p>
                <div className="mt-4 space-x-2">
                  {user.status !== "approved" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveUser(user._id);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                    >
                      Approve
                    </button>
                  )}
                  {updatedUsers[user._id] && (
                    <span className="text-green-500">
                      <FaCheck /> Updated
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(user);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No users found.</p>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this user?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminCRUD;