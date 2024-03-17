import React from "react";
import { useNavigate } from "react-router-dom";

const MainMenuButton = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/mainPage");
  };

  return <button onClick={handleNavigate}>Main Menu</button>;
};

export default MainMenuButton;
