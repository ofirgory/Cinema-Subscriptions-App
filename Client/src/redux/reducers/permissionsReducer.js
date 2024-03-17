import {
  FETCH_PERMISSIONS,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
} from "../actions";

// Initial state
const initialState = {
  permissions: [],
};

// Reducer
export function permissionsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload,
      };
    case CREATE_PERMISSION:
      return {
        ...state,
        permissions: [...state.permissions, action.payload],
      };
    case UPDATE_PERMISSION:
      const updatedPermissions = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      return {
        ...state,
        permissions: updatedPermissions,
      };
    case DELETE_PERMISSION:
      return {
        ...state,
        permissions: state.permissions.filter(
          (permission) => permission.id !== action.payload
        ),
      };
    default:
      return state;
  }
}
