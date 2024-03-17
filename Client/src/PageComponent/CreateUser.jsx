import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserPassword } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const CreateUserPage = () => {
  const [username, setUsername] = useState("");
  const [new_password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use the useNavigate hook here

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch an action to create the user
    dispatch(setUserPassword(username, new_password));
    alert("User Created");
    // Navigate back to the login page after dispatching
    navigate("/");
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={new_password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUserPage;
