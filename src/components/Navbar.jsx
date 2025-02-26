import "../fonts/index.css";

import {
  AppBar,
  IconButton,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  MenuItem,
  Menu,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import fitnessPrimaryLogo from "../assets/fitness1.png";
import fitnessSecondayrLogo from "../assets/fitness2.png";
import { motion } from "framer-motion";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { size } from "lodash";
import PropTypes from "prop-types";
const pages = ["Home", "About", "Contact", "Blog", "Services", "Login", "Register"];
import gsap from 'gsap'
import { SheetDemo } from "./sheet";
import { AuthContext, useAuth } from "../context/AuthContext";

function Navbar(props) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);


  const navigate = useNavigate();
  const navTheme = createTheme({
    palette: {
      mode: props.mode,
      primary: {
        main: "#000000",
      },
    },
  });
  const [anchorElNav, setAnchorElNav] = useState(null);
  // const [isLogged, setLogged] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (url) => {
    // navigate(url)sd
    location.href = urldsd;
    setAnchorElNav(null);
  };
  // const { scrollYProgress } = useViewportScroll();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [scale, setScale] = useState(1);
  const [y2, setY2] = useState(13);
  const [y, setY] = useState(0);
  const [x, setX] = useState(0);
  const [x2, setX2] = useState(0);
  const [x3, setX3] = useState(10);
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
      if (window.pageYOffset > 0) {
        setY(-50);
        setX(150);
        setX2(60);
        setScale(0.5);
        setY2(-22);
        setX3(70);
      } else {
        setScale(1);
        setY(0);
        setX3(10);
        setY2(13);
        setX(0);
        setX2(30);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.pageYOffset]);


  //gsap starts

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ensure initial styles are set to scale 1 and opacity 1


      // Timeline for animation
      const tl = gsap.timeline();



      gsap.utils.toArray('.nav-link').forEach((link) => {
        tl.fromTo(
          link,
          { x: 200, opacity: 0 }, // Starting position off-screen
          {
            x: 0, // Sliding in from the right
            opacity: 1, // Fading in
            duration: 0.3, // Duration of animation
            ease: "bounce.out", // Smooth easing effect

          }
        );
      });

      const logo = document.querySelector(".website-name");
      tl.fromTo(
        logo,
        {
          scale: 5, // Small size to simulate starting from a distance (z-axis)
          // Start from above the viewport
          opacity: 0, // Hidden initially
        },
        {
          scale: 1, // Full size upon impact
          y: 0, // Drop to its final position
          opacity: 1, // Fade in
          duration: 0.2, // Duration of the drop
          ease: "bounce.inOut",// Bounce effect on landing
          onComplete: () => {
            // Optional: Apply squash/stretch effect on impact
            gsap.to(logo, {
              scaleX: 0.5,
              scaleY: 0.5,
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: "bounce.inOut",
            });
          },
        }
      );



    });

    // Cleanup GSAP context
    return () => {
      ctx.revert();
    };
  }, []);

  //gsap ends



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };




  // console.log(user)
  return (
    <ThemeProvider theme={navTheme}>
      <AppBar

        // position="fixed top-0 z-50"
        position="fixed"
        className="navGsap"
        sx={{
          background:
            "linear-gradient(90deg, #232526 0%, #1F1C2C 35%, #414345 100%)",
        }}
        top="0"
        zIndex="1000"
      >
        <Container maxWidth="xl" sx={{}}>
          <Toolbar
            disableGutters
            sx={{
              height: scrollPosition > 0 ? "50px" : "100px",
              transition: "height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ display: { xs: "none", md: "flex" } }}
              component="div"
            >
              <NavLink to="/">
                <motion.img
                  src={fitnessPrimaryLogo}
                  alt="logo"
                  style={{
                    marginTop: "-55px",
                    height: "140px",
                    width: "150px",
                    position: "absolute",
                    top: "100%",
                    zIndex: 1,
                    scale: scale,
                    y: y,
                    transition:
                      "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    cursor: "pointer",
                  }}
                  // scale={scale}
                  whileHover={{ scale: scale + 0.2 }}
                />
              </NavLink>
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <motion.div
                sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
                style={{
                  x: x,
                  fontFamily: "Impact, Charcoal, sans-serif",
                  transition:
                    "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >

              </motion.div>
            </Typography>
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                mr: 2,
                display: { xs: "none", md: "flex" },
              }}
            >
              <motion.div

                className="website-name"
                style={{
                  fontFamily: "Future2",
                  letterSpacing: "0.5rem",
                  color: "white",
                  fontSize: { sm: "1rem", md: "2rem" },
                  fontWeight: "bold",
                }}
              >
                FitFlex
              </motion.div>
            </Typography>

            <motion.div className=" z-[1000] "
              sx={{
                zIndex: 10,
                flexGrow: 0,
                display: { xs: "flex", md: "none" },
                alignItems: "center",
              }}
            >
              {/* <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton> */}
              <div className="md:hidden">

                <SheetDemo user={user} />
              </div>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => {
                  if (page == "Login" || page == "Register") {
                    if (!user) {
                      return (
                        <MenuItem
                          key={page}
                          onClick={() => {
                            setAnchorElNav(null);
                            setTimeout(() => navigate(`/${page.toLowerCase()}`), 100);
                          }}
                        >
                          <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                      )
                    }
                  } else {
                    return (
                      <MenuItem
                        key={page}
                        onClick={() => {
                          setAnchorElNav(null);
                          setTimeout(() => navigate(`/${page.toLowerCase()}`), 100);
                        }}
                      >
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                    )
                  }

                })}
              </Menu>
            </motion.div>
            <Typography
              sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
              component="div"
            >
              <motion.img
                src={fitnessSecondayrLogo}
                alt="logo"
                style={{
                  marginTop: "-50px",
                  height: "90px",
                  width: "280px",
                  position: "absolute",
                  top: "100%",
                  zIndex: 1,
                  scale: scale - 0.1,
                  y: y2,
                  x: x3,
                  transition:
                    "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  cursor: "pointer",
                }}
                // Responsive styles for smartphones
                // sx={{
                //   "@media (max-width: 600px)": {
                //     height: "20px", // Reduced height for small screens
                //     width: "0px", // Reduced width for small screens
                //     marginRight: "30px",
                //   },
                // }}
                whileHover={{ scale: scale + 0.2 }}
              />
            </Typography>
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <motion.div
                initial={{ y: -250 }}
                animate={{ y: 0 }}
                transition={{ duration: 1 }}
                style={{
                  fontFamily: "Future2",
                  letterSpacing: window.innerWidth < 600 ? "0rem" : "0.0rem", // Adjust letterSpacing based on screen size
                  color: "white",
                  fontSize: window.innerWidth < 600 ? "1rem" : "1.6rem", // Responsive font size for mobile
                  fontWeight: "bold",
                  marginRight: "30px",
                  zIndex: 10,
                  transition:
                    "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                FitFlex
              </motion.div>
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex", } }}>
              {pages.map((page) => {
                if (page == "Login" || page == "Register") {
                  if (!user) {
                    return (

                      <Button
                        className="nav-link"
                        key={page}
                        onClick={() => {
                          setAnchorElNav(null);
                          navigate(`/${page.toLowerCase()}`);
                        }}
                        sx={{
                          my: 2,
                          color: "white",
                          display: "block",
                          alignItems: "center",
                          mx: 1,
                          "&:hover": {
                            backgroundColor: "#0e2338",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {page}
                      </Button>
                    )
                  }
                } else {
                  return (

                    <Button
                      className="nav-link"
                      key={page}
                      onClick={() => {
                        setAnchorElNav(null);
                        navigate(`/${page.toLowerCase()}`);
                      }}
                      sx={{
                        my: 2,
                        color: "white",
                        display: "block",
                        alignItems: "center",
                        mx: 1,
                        "&:hover": {
                          backgroundColor: "#0e2338",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {page}
                    </Button>

                  )
                }
              })}
              {
                user && (
                  <Button onClick={handleClick}>
                    <Avatar src={user?.profileUrl} alt={user?.name} />
                  </Button>
                )
              }

              <div style={{ display: "relative" }}>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      position: 'absolute',
                      transform: 'translateY(10px)',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" p={2}>
                    <Avatar src={user?.profileUrl} alt={user?.name} sx={{ width: 56, height: 56 }} />
                    <Box ml={2}>
                      <Typography variant="h6">{user?.name}</Typography>
                      <Typography variant="h5" color="textSecondary">{user?.firstname+" "+user?.lastname}</Typography>
                    </Box>
                  </Box>
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Profile</MenuItem>
                  <MenuItem onClick={() => { logout(); handleClose(); }}>Sign Out</MenuItem>
                </Menu>
              </div>

            </Box>
            <Box>
              <IconButton
                sx={{
                  ml: 1,
                  "@media (max-width: 900px)": {
                    position: "absolute",
                    right: "0px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  },
                  "&:hover": { backgroundColor: "transparent" },
                }}
                onClick={props.toggleMode}
                color="inherit"
              >
                {props.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Navbar;
