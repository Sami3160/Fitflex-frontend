import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Link,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BackgrundImg from "../assets/home/homeImg1.jpg";
import { useAuth } from "../context/AuthContext";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      await signup(data);
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url(${BackgrundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        marginTop: "9rem",
        fontFamily: "Future2",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(4px)",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: "90%",
          maxWidth: "500px",
          margin: "auto",
          fontFamily: "Future2",
        }}
        data-aos="zoom-in"
        data-aos-duration="1200"
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "center",
            fontFamily: "Future2",
            letterSpacing: { sm: "0rem", md: "0.5rem" },
            color: "red",
            fontSize: "1.9rem",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ""}
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                InputProps={{
                  sx: {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "green",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.firstName ? "red" : "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                FormHelperTextProps={{
                  sx: {
                    fontFamily: "Future2",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name (Optional)"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ""}
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                InputProps={{
                  sx: {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "green",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.lastName ? "red" : "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                FormHelperTextProps={{
                  sx: {
                    fontFamily: "Future2",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                InputProps={{
                  sx: {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "green",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.email ? "red" : "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                FormHelperTextProps={{
                  sx: {
                    fontFamily: "Future2",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                InputProps={{
                  sx: {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "green",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.password ? "red" : "green",
                    },
                    fontFamily: "Future2",
                  },
                  endAdornment: (
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                FormHelperTextProps={{
                  sx: {
                    fontFamily: "Future2",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword ? errors.confirmPassword.message : ""
                }
                InputLabelProps={{
                  sx: {
                    "&.Mui-focused": {
                      color: "green",
                    },
                    fontFamily: "Future2",
                  },
                }}
                InputProps={{
                  sx: {
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "green",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.confirmPassword ? "red" : "green",
                    },
                    fontFamily: "Future2",
                  },
                  endAdornment: (
                    <IconButton onClick={handleClickShowConfirmPassword}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                FormHelperTextProps={{
                  sx: {
                    fontFamily: "Future2",
                  },
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              padding: 1,
              background: "linear-gradient(to right, #972525, #e80b0b)",
              color: "#fff",
              fontFamily: "Future2",
              "&:hover": {
                background: "linear-gradient(to left, #972525, #e80b0b)",
              },
              "&:disabled": {
                background: "rgba(151, 37, 37, 0.5)",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              Already have an account?
              <Link
                href="/login"
                variant="body2"
                sx={{
                  fontFamily: "Future2",
                  color: "green",
                  padding: "0.5rem",
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  "&:hover": {
                    color: "#2b6f0e",
                  },
                }}
              >
                Log in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error || "Registration failed!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
