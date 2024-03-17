const initialState = {
  setPasswordSuccess: false,
  setPasswordError: "",
};

export const passwordReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PASSWORD_SUCCESS":
      return {
        ...state,
        setPasswordSuccess: true,
        setPasswordError: "",
      };
    case "SET_PASSWORD_FAILURE":
      return {
        ...state,
        setPasswordSuccess: false,
        setPasswordError: action.payload,
      };
    case "RESET_SET_PASSWORD_STATUS":
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
