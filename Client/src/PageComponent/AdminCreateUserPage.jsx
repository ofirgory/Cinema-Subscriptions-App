import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AdminCreateUser } from "../redux/actions";
import "../CSS/AdminCreatePage.css";

const AdminCreateUserPage = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create user object without permissions
    const newUser = { username, firstName, lastName };
    dispatch(AdminCreateUser(newUser));
    // Navigate to userPage after dispatch
    navigate("/userPage");
  };

  return (
    <form className="create-user-form" onSubmit={handleSubmit}>
      <h2>Create New User</h2>

      <div className="form-group">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
      </div>

      {/* Removed Permissions component from here */}

      <button type="submit">Create User</button>
    </form>
  );
};

export default AdminCreateUserPage;
