import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addMovie } from "../redux/actions";

const AddMoviePage = () => {
  const [movie, setMovie] = useState({
    name: "",
    genres: "",
    image: "",
    premiered: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const movieData = {
      ...movie,
      genres: movie.genres.split(",").map((genre) => genre.trim()), // Convert genres string to array
    };
    dispatch(addMovie(movieData)); // Dispatch the action to add a movie
    setMovie({ name: "", genres: "", image: "", premiered: "" }); // Reset form
  };

  return (
    <div>
      <h2>Add a New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={movie.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Genres (comma separated):</label>
          <input
            type="text"
            name="genres"
            value={movie.genres}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={movie.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Premiered Date:</label>
          <input
            type="date"
            name="premiered"
            value={movie.premiered}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
};

export default AddMoviePage;
