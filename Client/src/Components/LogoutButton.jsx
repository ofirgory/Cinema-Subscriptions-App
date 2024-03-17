import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Additional cleanup if necessary, e.g., redirecting the user
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
