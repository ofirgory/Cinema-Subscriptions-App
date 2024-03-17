import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions";
import "../CSS/MainPage.css";

function MainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Access the user's permissions
  const permissions = useSelector(
    (state) => state.auth.user.user.permissions || []
  );
  const firstName = useSelector((state) => state.auth.user.user.firstName);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Check for specific permissions
  const hasAdminPermission = permissions.includes("Admin");
  const hasViewMoviesPermission = permissions.includes("View Movies");
  // Check if the user has "View Subscriptions" permission
  const hasViewSubscriptionsPermission =
    permissions.includes("View Subscriptions");

  return (
    <div className="main-container">
      <h1>Main Page</h1>
      <h3>Welcome, {firstName}</h3>
      <nav>
        <ul>
          {hasViewMoviesPermission && (
            <li>
              <Link to="/MoviesPage" className="nav-tab">
                Movies
              </Link>
            </li>
          )}
          {/* Conditionally render Subscriptions link */}
          {hasViewSubscriptionsPermission && (
            <li>
              <Link to="/SubscriptionsPage" className="nav-tab">
                Subscriptions
              </Link>
            </li>
          )}
          {hasAdminPermission && (
            <li>
              <Link to="/userPage" className="nav-tab">
                User Management
              </Link>
            </li>
          )}
          <li>
            <button onClick={handleLogout}>Log Out</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default MainPage;
