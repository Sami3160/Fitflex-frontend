import { Outlet } from "react-router-dom";
import React from "react";
const Navbar = React.lazy(() => import("../components/Navbar"));
const Footer = React.lazy(() => import("../components/Footer"));
const BackToTopButton = React.lazy(() => import("../components/BacktoTop"));
const ProgressBar = React.lazy(() => import("../components/ProgressBar"));
export default function FullLayout({ mode, toggleMode, textcolor }) {
  return (
    <>
      <ProgressBar />
      <Navbar mode={mode} toggleMode={toggleMode} />
      <Outlet />
      <Footer />
      <BackToTopButton />
    </>
  );
}
