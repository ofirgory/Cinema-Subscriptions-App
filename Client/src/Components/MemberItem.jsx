import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../CSS/MemberItem.css";

const MemberItem = ({
  member,
  handleSubscribe,
  handleDeleteSubscription,
  watchedMovies,
  availableMovies,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");

  const permissions = useSelector(
    (state) => state.auth.user.user.permissions || []
  );

  const handleMovieChange = (e) => {
    setSelectedMovieId(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubscribeClick = () => {
    if (selectedMovieId && selectedDate) {
      handleSubscribe(member._id, selectedMovieId, selectedDate);
    } else {
      console.warn("Movie or date not selected");
    }
  };

  const handleDeleteSubscriptionClick = (movieId) => {
    handleDeleteSubscription(member._id, movieId);
  };

  // Permission check
  const hasEditMember = permissions.includes("Edit Member");
  const hasDeleteSubscription = permissions.includes("Delete Subscriptions");
  const canCreateSubscriptions = permissions.includes("Create Subscriptions");

  return (
    <div className="member-item">
      <h3>Name: {member.name}</h3>
      <p>Email: {member.email}</p>
      <p>City: {member.city}</p>
      {hasEditMember && (
        <li>
          <Link
            to={`/EditMemberPage/${member._id}`}
            className="edit-member-button"
          >
            Edit
          </Link>
        </li>
      )}
      <h4 className="movies-watched">Movies Watched:</h4>
      <ul className="member-watched-movies">
        {watchedMovies.map((movie) => (
          <li key={movie._id} className="watched-movie-item">
            {movie.name} - Watched on: {movie.watch_date}
            {/* Conditionally render Delete Subscription button */}
            {hasDeleteSubscription && (
              <button
                className="delete-subscription-button"
                onClick={() => handleDeleteSubscriptionClick(movie._id)}
              >
                Delete Subscription
              </button>
            )}
          </li>
        ))}
      </ul>
      <div>
        <h4 className="add-movie">Add a New Movie:</h4>
        <select className="select-dropdown" onChange={handleMovieChange}>
          <option value="">Select a movie</option>
          {availableMovies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.name}
            </option>
          ))}
        </select>
        <input type="date" className="date-input" onChange={handleDateChange} />
        {canCreateSubscriptions && (
          <button className="add-button" onClick={handleSubscribeClick}>
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberItem;
