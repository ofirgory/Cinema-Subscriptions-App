import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies, deleteMovie, fetchSubscriptions } from "../redux/actions";
import "../CSS/MoviesPage.css";

const MoviesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    movies,
    loading: loadingMovies,
    error: errorMovies,
  } = useSelector((state) => state.movie);
  const { subscriptions } = useSelector((state) => state.subscriptions);

  // Access the user's permissions
  const permissions = useSelector(
    (state) => state.auth.user.user.permissions || []
  );

  useEffect(() => {
    if (!movies.length) dispatch(fetchMovies());
    if (!subscriptions.length) dispatch(fetchSubscriptions());
  }, [dispatch, movies.length, subscriptions.length]);

  // Check for specific permissions
  const canUpdateMovies = permissions.includes("Update Movies");
  const canDeleteMovies = permissions.includes("Delete Movies");
  const canCreateMovies = permissions.includes("Create Movies");

  if (loadingMovies) return <div>Loading...</div>;
  if (errorMovies) return <div>Error: {errorMovies}</div>;

  const getSubscribedMembers = (movieId) => {
    return subscriptions
      .filter((subscription) =>
        subscription.movies.some((movie) => movie.movie_id === movieId)
      )
      .map((subscription) => subscription.member_info.name);
  };

  return (
    <div className="movies-container">
      <h1>Movies</h1>
      {/* Conditionally render the Add Movie link */}
      {canCreateMovies && (
        <Link to="/AddMoviePage" className="add-movie-link">
          Add Movie
        </Link>
      )}
      <div className="movies-grid">
        {movies.map((movie) => (
          <div className="movie-item" key={movie._id}>
            <div className="movie-details">
              <h3>Name: {movie.name}</h3>
              <p>Genres: {movie.genres.join(", ")}</p>
              <p>Premiered: {movie.premiered}</p>
              <div>
                <p>Subscriptions Watched:</p>
                <ul>
                  {getSubscribedMembers(movie._id).map((memberName, index) => (
                    <li key={index}>{memberName}</li>
                  ))}
                </ul>
              </div>
              <div className="movie-buttons">
                {canUpdateMovies && (
                  <button
                    onClick={() => navigate(`/EditMoviePage/${movie._id}`)}
                  >
                    Edit
                  </button>
                )}
                {canDeleteMovies && (
                  <button onClick={() => dispatch(deleteMovie(movie._id))}>
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="movie-image">
              <img src={movie.image} alt={movie.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
