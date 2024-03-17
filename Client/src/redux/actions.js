export const login = (username, password) => async (dispatch) => {
  try {
    // Attempt to login
    const loginResponse = await fetch("http://127.0.0.1:5173/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserName: username,
        Password: password.toString(), // Ensure password is a string
      }),
    });

    if (loginResponse.ok) {
      const { user, permissions } = await loginResponse.json(); // Assuming permissions are returned here

      // Dispatch login success action with user info and permissions
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user, // Assuming 'user' contains the user details
          permissions, // Directly using the permissions from the login response
        },
      });
    } else {
      // Dispatch login failure action if login failed
      dispatch({ type: "LOGIN_FAILURE" });
    }
  } catch (error) {
    // Handle errors
    console.error("Login process failed:", error);
    dispatch({ type: "LOGIN_FAILURE" });
  }
};

export const logout = () => {
  return {
    type: "LOGOUT",
  };
};

export const AdminCreateUser = (userData) => async (dispatch) => {
  try {
    const response = await fetch("http://127.0.0.1:5173/admin_create_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      // Dispatch a success action if needed
      alert("User created successfully");
    } else if (response.status === 403) {
      // Handle forbidden response indicating the user is not allowed to create users
      alert("You do not have permission to perform this action.");
    } else {
      // Handle other types of errors
      alert("Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    // Optionally dispatch a failure action
    alert("An error occurred while creating the user.");
  }
};

export const setUserPassword = (username, new_password) => async (dispatch) => {
  try {
    const response = await fetch("http://127.0.0.1:5173/set_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username, // Changed from UserName
        new_password: new_password, // Changed from Password
      }),
    });

    if (response.ok) {
      // Assuming the backend sends a success message or user data
      const data = await response.json();
      // Dispatch a success action, maybe to update local user state or redirect
      dispatch({
        type: "SET_PASSWORD_SUCCESS",
        payload: data.message || "Password updated successfully.",
      });
    } else {
      // If the server responds with an error (e.g., user not found or validation error)
      // Dispatch a failure action, maybe to show an error message
      dispatch({
        type: "SET_PASSWORD_FAILURE",
        payload: "Failed to update password. Please try again.",
      });
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Error setting password:", error);
    dispatch({
      type: "SET_PASSWORD_FAILURE",
      payload: "An error occurred. Please try again.",
    });
  }
};
// Actions for fetching users
export const FETCH_USERS_START = "FETCH_USERS_START";
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

// Async action creator for fetching users
export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_START });

  try {
    const response = await fetch("http://127.0.0.1:5173/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
};
// Add a constant for fetching user by ID actions
export const FETCH_USER_BY_ID_START = "FETCH_USER_BY_ID_START";
export const FETCH_USER_BY_ID_SUCCESS = "FETCH_USER_BY_ID_SUCCESS";
export const FETCH_USER_BY_ID_FAILURE = "FETCH_USER_BY_ID_FAILURE";

// Async action creator for fetching a single user by ID
export const fetchUserById = (_id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_USER_BY_ID_START });

    // Construct the URL with the user ID
    const url = `http://127.0.0.1:5173/api/users/${_id}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching user by ID: ${response.statusText}`);
    }

    const data = await response.json();

    dispatch({ type: FETCH_USER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_USER_BY_ID_FAILURE, payload: error.message });
  }
};

// Add constants for updating user actions
export const UPDATE_USER_START = "UPDATE_USER_START";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

// Async action creator for updating a user
export const updateUser = (_id, formData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_START });

  try {
    const response = await fetch(`http://127.0.0.1:5173/api/users/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    alert("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
    alert("Failed to update user");
  }
};

// Add constants for deleting user actions
export const DELETE_USER_START = "DELETE_USER_START";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
export const DELETE_USER_FAILURE = "DELETE_USER_FAILURE";

// Async action creator for deleting a user
export const deleteUser = (_id) => async (dispatch) => {
  dispatch({ type: DELETE_USER_START });

  try {
    const response = await fetch(`http://127.0.0.1:5173/api/users/${_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    dispatch({ type: DELETE_USER_SUCCESS, payload: _id });
    alert("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    dispatch({ type: DELETE_USER_FAILURE, payload: error.message });
    alert("Failed to delete user");
  }
};

// Permissions actions
export const FETCH_PERMISSIONS = "FETCH_PERMISSIONS";
export const CREATE_PERMISSION = "CREATE_PERMISSION";
export const UPDATE_PERMISSION = "UPDATE_PERMISSION";
export const DELETE_PERMISSION = "DELETE_PERMISSION";

// Action Creators
export function fetchPermissions() {
  return async (dispatch) => {
    try {
      const response = await fetch("http://127.0.0.1:5173/permissions");
      if (!response.ok) {
        throw new Error("Failed to fetch permissions");
      }
      const permissions = await response.json();

      dispatch({
        type: FETCH_PERMISSIONS,
        payload: permissions,
      });
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };
}

export function updatePermission(permissionId, updatedPermission) {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5173/permissions/${permissionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPermission), // Send the array directly
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update permission");
      }

      // Assuming the response contains the updated permission data
      const updatedPermissionData = await response.json();

      // Dispatch the action with the updated permission data
      dispatch({
        type: UPDATE_PERMISSION,
        payload: updatedPermissionData,
      });
      alert("Permissions Updated");

      // Return the updated permission data if needed in the component
      return updatedPermissionData;
    } catch (error) {
      console.error("Failed to update permission:", error);
    }
  };
}

export function deletePermission(permissionId) {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5173/permissions/${permissionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete permission");
      }

      dispatch({
        type: DELETE_PERMISSION,
        payload: permissionId,
      });
    } catch (error) {
      console.error("Failed to delete permission:", error);
    }
  };
}

// Movies actions

// Actions for fetching movies
export const FETCH_MOVIES_START = "FETCH_MOVIES_START";
export const FETCH_MOVIES_SUCCESS = "FETCH_MOVIES_SUCCESS";
export const FETCH_MOVIES_FAILURE = "FETCH_MOVIES_FAILURE";

// Async action creator for fetching movies
export const fetchMovies = () => async (dispatch) => {
  dispatch({ type: FETCH_MOVIES_START });

  try {
    const response = await fetch("http://127.0.0.1:5173/movies");
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    dispatch({ type: FETCH_MOVIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_MOVIES_FAILURE, payload: error.message });
  }
};
// Add a constant for fetching movie by ID actions
export const FETCH_MOVIE_BY_ID_START = "FETCH_MOVIE_BY_ID_START";
export const FETCH_MOVIE_BY_ID_SUCCESS = "FETCH_MOVIE_BY_ID_SUCCESS";
export const FETCH_MOVIE_BY_ID_FAILURE = "FETCH_MOVIE_BY_ID_FAILURE";

// Async action creator for fetching a single movie by ID
export const fetchMovieById = (_id) => async (dispatch) => {
  dispatch({ type: FETCH_MOVIE_BY_ID_START });

  // Correct the URL to include the 'movies' route segment and the movie ID
  const url = `http://127.0.0.1:5173/movies/${_id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching movie by ID: ${response.statusText}`);
    }

    const data = await response.json();

    dispatch({ type: FETCH_MOVIE_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_MOVIE_BY_ID_FAILURE, payload: error.message });
  }
};

export const ADD_MOVIE_START = "ADD_MOVIE_START";
export const ADD_MOVIE_SUCCESS = "ADD_MOVIE_SUCCESS";
export const ADD_MOVIE_FAILURE = "ADD_MOVIE_FAILURE";

// Async action creator for adding a new movie
export const addMovie = (movieData) => async (dispatch) => {
  dispatch({ type: ADD_MOVIE_START });

  try {
    const response = await fetch("http://127.0.0.1:5173/movies/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      // If the server responds with a status code outside the 200 range,
      // throw an error or dispatch a failure action
      const error = await response.text(); // Optionally, capture server response for the error
      throw new Error(error || "Failed to add movie");
    }

    const data = await response.json(); // Assuming the server responds with the added movie data
    dispatch({ type: ADD_MOVIE_SUCCESS, payload: data });
    alert("Movie added successfully");
  } catch (error) {
    console.error("Error adding movie:", error);
    dispatch({ type: ADD_MOVIE_FAILURE, payload: error.message });
    alert("Failed to add movie. Please try again.");
  }
};

// Add constants for updating movie actions
export const UPDATE_MOVIE_START = "UPDATE_MOVIE_START";
export const UPDATE_MOVIE_SUCCESS = "UPDATE_MOVIE_SUCCESS";
export const UPDATE_MOVIE_FAILURE = "UPDATE_MOVIE_FAILURE";

// Async action creator for updating a movie
export const updateMovie = (_id, movieData) => async (dispatch) => {
  dispatch({ type: UPDATE_MOVIE_START });

  try {
    const response = await fetch(`http://127.0.0.1:5173/movies/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      throw new Error("Failed to update movie");
    }
    const data = await response.json();
    dispatch({ type: UPDATE_MOVIE_SUCCESS, payload: data });
    alert("Movie updated successfully");
  } catch (error) {
    console.error("Error updating movie:", error);
    dispatch({ type: UPDATE_MOVIE_FAILURE, payload: error.message });
    alert("Failed to update movie");
  }
};
// Constants for deleting a movie
export const DELETE_MOVIE_START = "DELETE_MOVIE_START";
export const DELETE_MOVIE_SUCCESS = "DELETE_MOVIE_SUCCESS";
export const DELETE_MOVIE_FAILURE = "DELETE_MOVIE_FAILURE";

// Async action creator for deleting a movie
export const deleteMovie = (_id) => async (dispatch) => {
  dispatch({ type: DELETE_MOVIE_START });

  try {
    const response = await fetch(`http://127.0.0.1:5173/movies/${_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }

    dispatch({ type: DELETE_MOVIE_SUCCESS, payload: _id });
    alert("Movie deleted successfully");
  } catch (error) {
    console.error("Error deleting movie:", error);
    dispatch({ type: DELETE_MOVIE_FAILURE, payload: error.message });
    alert("Failed to delete movie");
  }
};

// Members Actions

export const FETCH_MEMBERS_START = "FETCH_MEMBERS_START";
export const FETCH_MEMBERS_SUCCESS = "FETCH_MEMBERS_SUCCESS";
export const FETCH_MEMBERS_FAILURE = "FETCH_MEMBERS_FAILURE";

// Async action creator for fetching movies
export const fetchMembers = () => async (dispatch) => {
  dispatch({ type: FETCH_MEMBERS_START });

  try {
    const response = await fetch("http://127.0.0.1:5173/members");
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    dispatch({ type: FETCH_MEMBERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_MEMBERS_FAILURE, payload: error.message });
  }
};
// Add a constant for fetching Members by ID actions
export const FETCH_MEMBER_BY_ID_START = "FETCH_MEMBER_BY_ID_START";
export const FETCH_MEMBER_BY_ID_SUCCESS = "FETCH_MEMBER_BY_ID_SUCCESS";
export const FETCH_MEMBER_BY_ID_FAILURE = "FETCH_MEMBER_BY_ID_FAILURE";

// Async action creator for fetching a single member by ID
export const fetchMemberById = (_id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MEMBER_BY_ID_START });

    // Construct the URL with the member ID
    const url = `http://127.0.0.1:5173/members/${_id}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching member by ID: ${response.statusText}`);
    }

    const data = await response.json();

    dispatch({ type: FETCH_MEMBER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_MEMBER_BY_ID_FAILURE, payload: error.message });
  }
};

export const CREATE_MEMBER_SUCCESS = "CREATE_MEMBER_SUCCESS";
export const CREATE_MEMBER_FAILURE = "CREATE_MEMBER_FAILURE";
export const RESET_CREATE_MEMBER_STATUS = "RESET_CREATE_MEMBER_STATUS";

export const createMember = (memberData) => async (dispatch) => {
  try {
    const response = await fetch("http://127.0.0.1:5173/members/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberData),
    });

    if (response.ok) {
      dispatch({ type: CREATE_MEMBER_SUCCESS });
    } else {
      dispatch({
        type: CREATE_MEMBER_FAILURE,
        payload: { error: "Failed to create member" },
      });
    }
  } catch (error) {
    dispatch({
      type: CREATE_MEMBER_FAILURE,
      payload: { error: "An error occurred while creating a member" },
    });
  }
};

// Add constants for updating member actions
export const UPDATE_MEMBER_START = "UPDATE_MEMBER_START";
export const UPDATE_MEMBER_SUCCESS = "UPDATE_MEMBER_SUCCESS";
export const UPDATE_MEMBER_FAILURE = "UPDATE_MEMBER_FAILURE";

// Async action creator for updating a member
export const updateMember = (_id, memberData) => async (dispatch) => {
  dispatch({ type: UPDATE_MEMBER_START });

  try {
    const response = await fetch(
      `http://127.0.0.1:5173/members/update/${_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update member");
    }
    const data = await response.json();
    dispatch({ type: UPDATE_MEMBER_SUCCESS, payload: data });
    alert("Member updated successfully");
  } catch (error) {
    console.error("Error updating member:", error);
    dispatch({ type: UPDATE_MEMBER_FAILURE, payload: error.message });
    alert("Failed to update member");
  }
};
// Constants for deleting a member
export const DELETE_MEMBER_START = "DELETE_MEMBER_START";
export const DELETE_MEMBER_SUCCESS = "DELETE_MEMBER_SUCCESS";
export const DELETE_MEMBER_FAILURE = "DELETE_MEMBER_FAILURE";

// Async action creator for deleting a member
export const deleteMember = (_id) => async (dispatch) => {
  dispatch({ type: DELETE_MEMBER_START });

  try {
    const response = await fetch(
      `http://127.0.0.1:5173/members/delete/${_id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete member");
    }

    dispatch({ type: DELETE_MEMBER_SUCCESS, payload: _id });
    alert("Member deleted successfully");
  } catch (error) {
    console.error("Error deleting member:", error);
    dispatch({ type: DELETE_MEMBER_FAILURE, payload: error.message });
    alert("Failed to delete member");
  }
};

// Subscriptions Actions

export const FETCH_SUBSCRIPTIONS_START = "FETCH_SUBSCRIPTIONS_START";
export const FETCH_SUBSCRIPTIONS_SUCCESS = "FETCH_SUBSCRIPTIONS_SUCCESS";
export const FETCH_SUBSCRIPTIONS_FAILURE = "FETCH_SUBSCRIPTIONS_FAILURE";

export const ADD_SUBSCRIPTION_START = "ADD_SUBSCRIPTION_START";
export const ADD_SUBSCRIPTION_SUCCESS = "ADD_SUBSCRIPTION_SUCCESS";
export const ADD_SUBSCRIPTION_FAILURE = "ADD_SUBSCRIPTION_FAILURE";

export const DELETE_SUBSCRIPTION_START = "DELETE_SUBSCRIPTION_START";
export const DELETE_SUBSCRIPTION_SUCCESS = "DELETE_SUBSCRIPTION_SUCCESS";
export const DELETE_SUBSCRIPTION_FAILURE = "DELETE_SUBSCRIPTION_FAILURE";

export const SHOW_ALERT = "SHOW_ALERT";
export const CLEAR_ALERT = "CLEAR_ALERT"; // Add this line

export const fetchSubscriptions = () => async (dispatch) => {
  dispatch({ type: FETCH_SUBSCRIPTIONS_START });

  try {
    const response = await fetch("http://127.0.0.1:5173/subscriptions/all");
    if (!response.ok) {
      throw new Error("Failed to fetch subscriptions");
    }
    const data = await response.json();
    dispatch({ type: FETCH_SUBSCRIPTIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_SUBSCRIPTIONS_FAILURE, payload: error.message });
  }
};

// Async action creator for adding a new subscription
export const addSubscription = (subscriptionData) => async (dispatch) => {
  dispatch({ type: ADD_SUBSCRIPTION_START });

  try {
    const response = await fetch("http://127.0.0.1:5173/subscriptions/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      throw new Error("Failed to add subscription");
    }
    const data = await response.json();
    dispatch({ type: ADD_SUBSCRIPTION_SUCCESS, payload: data });
    dispatch({ type: SHOW_ALERT, payload: "Subscription added" }); // Dispatch SHOW_ALERT action
  } catch (error) {
    dispatch({ type: ADD_SUBSCRIPTION_FAILURE, payload: error.message });
  }
};

export const deleteSubscription = (member_id, movie_id) => async (dispatch) => {
  dispatch({ type: DELETE_SUBSCRIPTION_START });

  try {
    const response = await fetch(
      `http://127.0.0.1:5173/subscriptions/delete/${member_id}/${movie_id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete subscription");
    }

    dispatch({
      type: DELETE_SUBSCRIPTION_SUCCESS,
      payload: { member_id, movie_id },
    });
    alert("Subscription deleted successfully");
  } catch (error) {
    console.error("Error deleting subscription:", error);
    dispatch({ type: DELETE_SUBSCRIPTION_FAILURE, payload: error.message });
    alert("Failed to delete subscription");
  }
};
