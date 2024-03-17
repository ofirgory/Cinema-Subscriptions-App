import {
  FETCH_MOVIES_START,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILURE,
  DELETE_MOVIE_START,
  DELETE_MOVIE_SUCCESS,
  DELETE_MOVIE_FAILURE,
  ADD_MOVIE_START,
  ADD_MOVIE_SUCCESS,
  ADD_MOVIE_FAILURE,
} from "../actions";

const initialState = {
  createMovieSuccess: false,
  createMovieError: "",
  movies: [],
  loading: false,
  error: null,
};

export const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MOVIE_START:
      return {
        ...state,
        loading: true,
        createMovieSuccess: false,
        createMovieError: "",
      };
    case ADD_MOVIE_SUCCESS:
      return {
        ...state,
        movies: [...state.movies, action.payload], // Assuming payload is the new movie
        loading: false,
        createMovieSuccess: true,
      };
    case ADD_MOVIE_FAILURE:
      return {
        ...state,
        loading: false,
        createMovieError: action.payload,
        createMovieSuccess: false,
      };

    case "CREATE_MOVIE_SUCCESS":
      return {
        ...state,
        createMovieSuccess: true,
        createMovieError: "",
      };
    case "CREATE_MOVIE_FAILURE":
      return {
        ...state,
        createMovieSuccess: false,
        createMovieError: action.payload.error,
      };
    case "RESET_CREATE_MOVIE_STATUS":
      return {
        ...initialState,
      };

    case FETCH_MOVIES_START:
      return { ...state, loading: true, error: null };
    case FETCH_MOVIES_SUCCESS:
      return { ...state, loading: false, movies: action.payload };
    case FETCH_MOVIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_MOVIE_START:
      return { ...state, loading: true };
    case DELETE_MOVIE_SUCCESS:
      return {
        ...state,
        movies: state.movies.filter((movie) => movie._id !== action.payload),
        loading: false,
      };
    case DELETE_MOVIE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
