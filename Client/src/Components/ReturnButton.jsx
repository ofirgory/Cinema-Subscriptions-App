import React from "react";
import { useNavigate } from "react-router-dom";

const ReturnButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return <button onClick={handleGoBack}>Go Back</button>;
};

export default ReturnButton;
