import React from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/mainPage");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <header>
        <button onClick={handleNavigateHome}>Return to Main Menu</button>
        <button onClick={handleGoBack}>Go Back</button>
      </header>
      <main>
        {children}{" "}
        {/* This is where the page-specific component will be rendered */}
      </main>
    </div>
  );
};

export default Layout;
