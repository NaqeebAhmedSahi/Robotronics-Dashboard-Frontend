import React, { useState } from "react";
import { Box, Typography, Button, Avatar, TextField, IconButton, Grid, InputAdornment } from "@mui/material";
import AdminSidebar from "../components/AdminSidebar"; // Import your sidebar component
import { FaEye, FaEyeSlash, FaSave, FaSignOutAlt, FaSyncAlt } from "react-icons/fa";

const MyProfile: React.FC = () => {
  const profile = {
    name: "Admin Name",
    email: "admin@example.com",
    role: "Administrator",
    profileImage: "https://via.placeholder.com/150", // Dummy profile image
    joinedDate: "January 1, 2023",
    username: "admin123",
    phoneNumber: "+1234567890",
    password: "password123", // Example of sensitive information
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    // Add your save logic here (e.g., API call to update profile)
    console.log("Profile updated:", formData);
    setFeedbackMessage("Profile updated successfully!");
    setTimeout(() => setFeedbackMessage(""), 3000); // Clear message after 3 seconds
  };

  const handleLogout = () => {
    // Clear tokens, session storage, or handle logout logic
    console.log("User logged out");
    window.location.href = "/login"; // Redirect to login page
  };

  const handleSwitchAccount = () => {
    // Logic to switch to another account (e.g., redirect or API call)
    console.log("Switching account...");
    setFeedbackMessage("Switched to a different account.");
    setTimeout(() => setFeedbackMessage(""), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: "24px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 800,
          margin: "auto",
        }}
      >
        {/* Top-right Avatar */}
        <Box
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            bgcolor: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            boxShadow: 1,
          }}
        >
          <Avatar sx={{ bgcolor: "#3f51b5", width: 40, height: 40 }}>A</Avatar>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {formData.name}
          </Typography>
        </Box>

        {/* Profile Header */}
        <Typography variant="h4" align="center" gutterBottom>
          My Profile
        </Typography>

        {/* Feedback Message */}
        {feedbackMessage && (
          <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
            {feedbackMessage}
          </Typography>
        )}

        <Grid container spacing={3} sx={{ mt: 4, width: "100%" }}>
          {/* First Column */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Buttons Group */}

          <Button sx={{ display: "flex", mt: 4 }}
            variant="contained"
            color="primary"
            startIcon={<FaSave />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Box sx={{ display: "flex", gap: 16, mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FaSyncAlt />}
            onClick={handleSwitchAccount}
          >
            Switch Account
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<FaSignOutAlt />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default MyProfile;
