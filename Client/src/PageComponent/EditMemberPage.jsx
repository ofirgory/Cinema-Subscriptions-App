import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMemberById, updateMember } from "../redux/actions";
import "../CSS/EditMemberPage.css";

const EditMemberPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useParams();
  const { selectedMember, loading, error } = useSelector(
    (state) => state.member
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    dispatch(fetchMemberById(_id));
  }, [_id, dispatch]);

  useEffect(() => {
    if (selectedMember) {
      setFormData({
        name: selectedMember.name || "",
        email: selectedMember.email || "",
        city: selectedMember.city || "",
      });
    }
  }, [selectedMember]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateMember(_id, formData));
    navigate("/SubscriptionsPage");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-member-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Update Member</button>
      </form>
    </div>
  );
};

export default EditMemberPage;
