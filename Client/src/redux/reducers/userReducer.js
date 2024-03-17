import {
  FETCH_USERS_START,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_BY_ID_START,
  FETCH_USER_BY_ID_SUCCESS,
  FETCH_USER_BY_ID_FAILURE,
  UPDATE_USER_START,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  DELETE_USER_START,
  DELETE_USER_FAILURE,
} from "../actions";

const initialState = {
  createUserSuccess: false,
  createUserError: "",
  users: [],
  selectedUser: null, // Add state for the selected user
  loading: false,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_USER_SUCCESS":
      return {
        ...state,
        createUserSuccess: true,
        createUserError: "",
      };
    case "CREATE_USER_FAILURE":
      return {
        ...state,
        createUserSuccess: false,
        createUserError: action.payload.error,
      };
    case "RESET_CREATE_USER_STATUS":
      return {
        ...initialState,
      };
    case FETCH_USERS_START:
      return { ...state, loading: true, error: null };
    case FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_USER_BY_ID_START:
      return { ...state, loading: true, error: null };
    case FETCH_USER_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedUser: action.payload };
    case FETCH_USER_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        selectedUser: null,
      };
    case UPDATE_USER_START:
      return { ...state, loading: true };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case UPDATE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_USER_START:
      return { ...state, loading: true };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => user.id !== action.payload), // assuming action.payload is the id of the deleted user
      };
    case DELETE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
