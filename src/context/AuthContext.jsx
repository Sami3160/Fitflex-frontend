import axios from "axios";
import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
// import { configDotenv } from "dotenv";
const URL = import.meta.env.VITE_API_URL;
export const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUserData = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUserId = localStorage.getItem('_id');
            // console.log(storedToken)
            if (storedToken && storedUserId) {
                try {
                    const response = await axios.get(`${URL}/api/users/info`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });
                    if (response.data) {
                        setUser(response.data);
                        setToken(storedToken);
                        // console.log("data",response.data)
                    }
                } catch (error) {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('_id');        
                    console.log("Error fetching user data: ", error);
                }
            }
        };

        fetchUserData();
    }, []);
    const login = async (data) => {
        const response = await axios.post(`${URL}/api/users/login`, data)
        if (response.data) {
            console.log(response)
            setUser(response.data.user)
            setToken(response.data.token)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('_id', response.data.user._id)
            alert("Login successful")
            navigate("/dashboard")
            return
        }

        throw new Error(response.data.message)
    }

    const refreshUser = async () => {
        try {
            const response = await axios.get(`${URL}/api/users/info`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            // console.log(response)
            if (response.data.data) {
                setUser(response.data.data)
                return
            }
            // console.log(response)
        } catch (error) {
            console.log("Error in AuthContext.jsx -> refreshUser: \n", error);
        }
    }

    const signup = async (data) => {
        try {
            const response = await axios.post(`${URL}/api/users/signup`, {
                firstname: data.firstName,
                lastname: data.lastName || '',
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword
            });
            
            if (response.data) {
                console.log(response);
                setUser(response.data.user);
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('_id', response.data.user._id);
                alert("Registration successful");
                navigate("/dashboard");
                return response.data;
            }
        } catch (error) {
            console.error("Signup error:", error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Registration failed. Please try again.");
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('_id')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, logout, login, signup, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}