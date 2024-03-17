import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions";
import "../CSS/LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Redirect to the main page if the user is authenticated
    if (isAuthenticated) {
      navigate("/MainPage");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch(login(username, password)); // Dispatch the login action
      // Do not reset username and password here as it will trigger before the effect
    } else {
      // Handle the error case, like showing an error message
    }
  };

  const handleCreateUser = () => {
    navigate("/CreateUser"); // Navigate to the create user page
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <br />
        <div>
          <button type="button" onClick={handleCreateUser}>
            Create a System User
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
