import React from "react";
import { Box, Typography, Container } from "@mui/material";
import AdminSidebar from "../components/AdminSidebar";

const RoboSchoole = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <Box 
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography 
            variant="h2" 
            sx={{
              fontWeight: "bold", 
              color: "#3f51b5",
              mb: 2,
            }}
          >
            Coming Soon
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              fontSize: "1.2rem",
              color: "#555",
            }}
          >
            Stay tuned! We're working hard to bring you this feature. Check back later for updates.
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default RoboSchoole;
