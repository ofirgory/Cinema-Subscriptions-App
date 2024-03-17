import {
  FETCH_MEMBERS_START,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  FETCH_MEMBER_BY_ID_START,
  FETCH_MEMBER_BY_ID_SUCCESS,
  FETCH_MEMBER_BY_ID_FAILURE,
  DELETE_MEMBER_START,
  DELETE_MEMBER_SUCCESS,
  DELETE_MEMBER_FAILURE,
  CREATE_MEMBER_SUCCESS,
  CREATE_MEMBER_FAILURE,
  RESET_CREATE_MEMBER_STATUS,
  ADD_SUBSCRIPTION_SUCCESS, // Import the ADD_SUBSCRIPTION_SUCCESS action type
} from "../actions";

const initialState = {
  createMemberSuccess: false,
  createMemberError: "",
  members: [],
  memberMovies: {},
  selectedMember: null,
  loading: false,
  error: null,
};

export const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_MEMBER_SUCCESS:
      return {
        ...state,
        createMemberSuccess: true,
        createMemberError: "",
      };
    case CREATE_MEMBER_FAILURE:
      return {
        ...state,
        createMemberSuccess: false,
        createMemberError: action.payload.error,
      };
    case RESET_CREATE_MEMBER_STATUS:
      return {
        ...state,
        createMemberSuccess: false,
        createMemberError: "",
      };
    case FETCH_MEMBERS_START:
      return { ...state, loading: true, error: null };
    case FETCH_MEMBERS_SUCCESS:
      return { ...state, loading: false, members: action.payload };
    case FETCH_MEMBERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_MEMBER_BY_ID_START:
      return { ...state, loading: true, error: null };
    case FETCH_MEMBER_BY_ID_SUCCESS:
      return { ...state, loading: false, selectedMember: action.payload };
    case FETCH_MEMBER_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_MEMBER_START:
      return { ...state, loading: true };
    case DELETE_MEMBER_SUCCESS:
      return {
        ...state,
        members: state.members.filter(
          (member) => member._id !== action.payload
        ),
        loading: false,
      };
    case DELETE_MEMBER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_SUBSCRIPTION_SUCCESS:
      const {
        member_id: addedMemberId,
        movie_id: addedMovieId,
        watch_date: addedWatchDate,
      } = action.payload;
      return {
        ...state,
        memberMovies: {
          ...state.memberMovies,
          [addedMemberId]: [
            ...(state.memberMovies[addedMemberId] || []),
            addedMovieId,
          ],
        },
      };
    default:
      return state;
  }
};
