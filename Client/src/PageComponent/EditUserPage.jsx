import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserById, updateUser } from "../redux/actions";
import Permissions from "../Components/Permissions";
import "../CSS/EditUserPage.css";

const EditUserPage = () => {
  const dispatch = useDispatch();

  const { _id } = useParams();
  const { selectedUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    _id: "",
    UserName: "",
    FirstName: "",
    LastName: "",
  });

  useEffect(() => {
    // Call fetchUserById action with the _id from the URL parameters
    dispatch(fetchUserById(_id));
  }, [_id, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      console.log("User Data for Edit:", selectedUser);
      setFormData({
        _id: selectedUser._id,
        UserName: selectedUser.UserName || "",
        FirstName: selectedUser.FirstName || "",
        LastName: selectedUser.LastName || "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(_id, formData));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-user-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            ID:
            <input
              type="text"
              name="ID"
              value={formData._id}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            UserName:
            <input
              type="text"
              name="UserName"
              value={formData.UserName}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            First Name:
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Last Name:
            <input
              type="text"
              name="LastName"
              value={formData.LastName}
              onChange={handleChange}
            />
          </label>
        </div>
        <Permissions userId={_id} />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default EditUserPage;
