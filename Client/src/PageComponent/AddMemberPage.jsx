import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createMember } from "../redux/actions";

const AddMemberPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object with the member's information
    const memberData = {
      name,
      email,
      city,
    };

    // Dispatch an action to create the member with the memberData object
    dispatch(createMember(memberData));
  };

  return (
    <div>
      <h2>Create Member</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Member</button>
      </form>
    </div>
  );
};

export default AddMemberPage;
