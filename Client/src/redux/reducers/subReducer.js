// Import the action types if not already imported
import {
  FETCH_SUBSCRIPTIONS_START,
  FETCH_SUBSCRIPTIONS_SUCCESS,
  FETCH_SUBSCRIPTIONS_FAILURE,
  ADD_SUBSCRIPTION_START,
  ADD_SUBSCRIPTION_SUCCESS,
  ADD_SUBSCRIPTION_FAILURE,
  DELETE_SUBSCRIPTION_START,
  DELETE_SUBSCRIPTION_SUCCESS,
  DELETE_SUBSCRIPTION_FAILURE,
  SHOW_ALERT,
  CLEAR_ALERT,
} from "../actions";

// Define the initial state
const initialState = {
  subscriptions: [],
  isLoading: false,
  error: null,
  alert: null,
};

// Define the subReducer function
const subReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUBSCRIPTIONS_START:
    case ADD_SUBSCRIPTION_START:
    case DELETE_SUBSCRIPTION_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_SUBSCRIPTIONS_SUCCESS:
      const updatedMemberMovies = {};
      action.payload.forEach((subscription) => {
        const member_id = subscription.member_id;
        const movies = subscription.movies.map((movie) => movie.movie_id);
        updatedMemberMovies[member_id] = movies;
      });
      return {
        ...state,
        isLoading: false,
        subscriptions: action.payload,
        // You can include the updatedMemberMovies here if needed
      };
    case ADD_SUBSCRIPTION_SUCCESS:
      const {
        member_id: addedMemberId,
        movie_id: addedMovieId,
        watch_date: addedWatchDate,
      } = action.payload;
      // Update the memberMovies state in the memberReducer
      return {
        ...state,
        isLoading: false,
        // You can also include the subscription details in subscriptions if needed
        subscriptions: [
          ...state.subscriptions,
          {
            member_id: addedMemberId,
            movie_id: addedMovieId,
            watch_date: addedWatchDate,
          },
        ],
      };
    case DELETE_SUBSCRIPTION_SUCCESS:
      const { member_id, movie_id } = action.payload;
      const updatedSubscriptions = state.subscriptions.filter(
        (subscription) =>
          subscription.member_id !== member_id ||
          subscription.movie_id !== movie_id
      );
      return {
        ...state,
        isLoading: false,
        subscriptions: updatedSubscriptions,
      };
    case FETCH_SUBSCRIPTIONS_FAILURE:
    case ADD_SUBSCRIPTION_FAILURE:
    case DELETE_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case SHOW_ALERT:
      return {
        ...state,
        alert: action.payload,
      };

    case CLEAR_ALERT:
      return {
        ...state,
        alert: null,
      };
    default:
      return state;
  }
};

export default subReducer;
