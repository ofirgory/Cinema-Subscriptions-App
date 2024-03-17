import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateMovie, fetchMovieById } from "../redux/actions";

const EditMoviePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Assuming your Redux state structure and naming conventions
  const movieDetails = useSelector((state) =>
    state.movie.movies.find((movie) => movie._id === movieId)
  );

  // Initialize form state with movie details or default values
  const [movie, setMovie] = useState({
    name: "",
    genres: "",
    image: "",
    premiered: "",
  });

  // Fetch movie details when component mounts or when movieId changes
  useEffect(() => {
    if (!movieDetails) {
      // If you have an action to fetch a single movie, dispatch it here
      dispatch(fetchMovieById(movieId));
    } else {
      setMovie({
        name: movieDetails.name || "",
        genres: movieDetails.genres.join(", ") || "",
        image: movieDetails.image || "",
        premiered: movieDetails.premiered || "",
      });
    }
  }, [dispatch, movieId, movieDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the submit button to prevent double submissions
    const movieData = {
      ...movie,
      genres: movie.genres.split(",").map((genre) => genre.trim()),
    };

    try {
      await dispatch(updateMovie(movieId, movieData));
      navigate("/MoviesPage"); // Adjust this to your actual movies page route
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("Failed to update movie");
    } finally {
      setIsSubmitting(false); // Re-enable the submit button after the action is completed
    }
  };

  return (
    <div>
      <h2>Edit Movie</h2>
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
          <label>Genres:</label>
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
        <button type="submit" disabled={isSubmitting}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditMoviePage;
