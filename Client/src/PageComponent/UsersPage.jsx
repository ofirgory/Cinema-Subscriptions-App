import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/actions";
import "../CSS/Permissions.css";
import "../CSS/UsersPage.css";
import Permissions from "../Components/Permissions";

const UsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users || []); // Adjusted based on your state structure for users
  const permissions = useSelector(
    (state) => state.auth.user.user.permissions || []
  ); // Correctly accessing permissions
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditClick = (_id) => {
    navigate(`/EditUserPage/${_id}`, { state: { _id } });
  };

  const handleDeleteClick = (_id) => {
    dispatch(deleteUser(_id));
    navigate("/userPage");
  };

  // Check if the user has "Admin" permission
  const hasAdminPermission = permissions.includes("Admin");

  return (
    <div className="users-container">
      <h1>Users</h1>
      {hasAdminPermission && (
        <Link to="/AdminCreateUserPage" className="add-user-link">
          Admin - Create User
        </Link>
      )}
      <div>
        {users.map((user, index) => (
          <div key={index} className="user-item">
            <h3>
              Name: {user.FirstName} {user.LastName}
            </h3>
            <p>Username: {user.UserName}</p>
            <p>Created Date: {user.CreationDate}</p>
            <Permissions userId={user._id} />
            <button onClick={() => handleEditClick(user._id)}>Edit User</button>
            <button onClick={() => handleDeleteClick(user._id)}>
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
