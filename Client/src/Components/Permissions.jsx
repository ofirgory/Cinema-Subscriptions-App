import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../CSS/Permissions.css";
import { fetchPermissions, updatePermission } from "../redux/actions";

const Permissions = ({ userId, onPermissionsUpdate }) => {
  const dispatch = useDispatch();

  // Accessing permissions data correctly based on the provided state structure
  const permissionsData = useSelector(
    (state) => state.permissions.permissions.data || []
  );

  const [userPermissions, setUserPermissions] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    // Find the user's permissions in the fetched data
    const user = permissionsData.find((perm) => perm._id === userId);
    if (user) {
      setUserPermissions(user.permissions || []);
    }
  }, [userId, permissionsData, setAlertMessage]);

  const allPermissions = [
    "Add Member",
    "View Subscriptions",
    "Create Subscriptions",
    "Update Subscriptions",
    "Delete Subscriptions",
    "View Movies",
    "Create Movies",
    "Update Movies",
    "Delete Movies",
  ];

  const handlePermissionChange = (permission) => {
    let updatedPermissions = [...userPermissions];

    // Automatically check "View Subscriptions" when other subscription permissions are selected
    if (
      [
        "Create Subscriptions",
        "Update Subscriptions",
        "Delete Subscriptions",
      ].includes(permission) &&
      !updatedPermissions.includes("View Subscriptions")
    ) {
      updatedPermissions.push("View Subscriptions");
    }

    // Automatically check "View Movies" when other movie permissions are selected
    if (
      ["Create Movies", "Update Movies", "Delete Movies"].includes(
        permission
      ) &&
      !updatedPermissions.includes("View Movies")
    ) {
      updatedPermissions.push("View Movies");
    }

    // Toggle the clicked permission
    if (updatedPermissions.includes(permission)) {
      updatedPermissions = updatedPermissions.filter(
        (perm) => perm !== permission
      );
    } else {
      updatedPermissions.push(permission);
    }

    setUserPermissions(updatedPermissions);
  };

  const handleUpdatePermissions = () => {
    try {
      const response = dispatch(updatePermission(userId, userPermissions));
      if (
        response.payload &&
        response.payload.message === "Permission updated successfully."
      ) {
        setAlertMessage("Permissions updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update permissions:", error);
    }
  };

  return (
    <div className="permissions-container">
      <h3>User Permissions:</h3>
      <ul className="permissions-list">
        {allPermissions.map((permission, index) => (
          <li className="permission-item" key={index}>
            <label>
              <input
                type="checkbox"
                checked={userPermissions.includes(permission)}
                onChange={() => handlePermissionChange(permission)}
              />
              {permission}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleUpdatePermissions}>Update Permissions</button>
      {alertMessage && <div className="alert">{alertMessage}</div>}
    </div>
  );
};

export default Permissions;
