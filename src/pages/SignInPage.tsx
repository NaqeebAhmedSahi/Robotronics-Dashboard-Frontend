import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Avatar, IconButton, InputAdornment } from "@mui/material";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";

const SignInPage: React.FC = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setCredentials({ ...credentials, [field]: value });
    };

    const handleSignIn = () => {
        // Placeholder for sign-in logic
        console.log("Signing in with:", credentials);
        alert("Sign-in functionality not implemented yet.");
    };

    return (
        <div className="admin-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    backgroundColor: "#fff",
                    padding: "40px",
                    borderRadius: "8px",
                    boxShadow: 3,
                }}
            >
                <Avatar sx={{ bgcolor: "#3f51b5", width: 60, height: 60, margin: "0 auto" }}>
                    <FaSignInAlt />
                </Avatar>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={credentials.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}

                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            value={credentials.password}
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
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSignIn}
                            sx={{ padding: "12px", fontSize: "1rem", height: "50px" }}
                        >
                            Sign In
                        </Button>

                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default SignInPage;
