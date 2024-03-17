import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { passwordReducer } from "./passwordReducer";
import { movieReducer } from "./movieReducer";
import { memberReducer } from "./membersReducer";
import subReducer from "./subReducer";
import { permissionsReducer } from "./permissionsReducer";

const rootReducer = combineReducers({
  member: memberReducer,
  movie: movieReducer,
  auth: authReducer,
  user: userReducer,
  password: passwordReducer,
  subscriptions: subReducer,
  permissions: permissionsReducer,
});

export default rootReducer;
