import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMembers,
  fetchMovies,
  fetchSubscriptions,
  addSubscription,
  deleteSubscription,
} from "../redux/actions";
import { Link } from "react-router-dom";
import MemberItem from "../Components/MemberItem";
import "../CSS/SubscriptionsPage.css";

const SubscriptionsPage = () => {
  const dispatch = useDispatch();
  const [selectedMovie, setSelectedMovie] = useState({});
  const [subscriptionAdded, setSubscriptionAdded] = useState(false);
  const [subscriptionDeleted, setSubscriptionDeleted] = useState(false);

  // Redux state selectors
  const {
    members,
    loading: loadingMembers,
    error: errorMembers,
  } = useSelector((state) => state.member);

  const {
    movies,
    loading: loadingMovies,
    error: errorMovies,
  } = useSelector((state) => state.movie);
  const { subscriptions } = useSelector((state) => state.subscriptions);
  const { alert } = useSelector((state) => state.subscriptions);

  const permissions = useSelector(
    (state) => state.auth.user.user.permissions || []
  ); // Correctly accessing permissions

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchMovies());
    dispatch(fetchSubscriptions());
  }, [dispatch, subscriptionAdded, subscriptionDeleted]);

  useEffect(() => {
    if (alert) {
      window.alert(alert);
      // Dispatch an action to clear the alert after it's shown
      dispatch({ type: "CLEAR_ALERT" });
      setSubscriptionAdded(false);
    }
  }, [alert, dispatch]);

  const handleMovieSelect = (memberId, movieId) => {
    // Temporarily store the selected movie ID for the given member
    setSelectedMovie({ ...selectedMovie, [memberId]: movieId });
  };

  const handleDateSelect = (memberId, selectedDate) => {
    // Assuming you set the selected date in state or context
    setSubscriptionDetails({ ...subscriptionDetails, date: selectedDate });
  };

  const handleSubscribe = (memberId, movieId, watchDate) => {
    // Constructing the payload to match the expected document structure
    const payload = {
      member_id: { $oid: memberId },
      movies: [
        {
          movie_id: { $oid: movieId },
          watch_date: watchDate,
        },
      ],
    };

    dispatch(addSubscription(payload));
    setSubscriptionAdded(true);
  };
  const handleDeleteSubscription = (memberId, movieId, watchDate) => {
    dispatch(deleteSubscription(memberId, movieId, watchDate));
    setSubscriptionDeleted(true);
  };

  const processedSubs = React.useMemo(
    () =>
      subscriptions.reduce((acc, sub) => {
        if (sub.member_info?._id) {
          acc[sub.member_info._id] = sub.movies
            .map((movieSub) => {
              const movieDetail = movies.find(
                (movie) => movie._id === movieSub.movie_id
              );
              return movieDetail
                ? { ...movieDetail, watch_date: movieSub.watch_date }
                : null;
            })
            .filter((movie) => movie !== null);
        }
        return acc;
      }, {}),
    [subscriptions, movies]
  );

  const getAvailableMoviesForMember = (memberId) => {
    const watchedMovieIds = new Set(
      processedSubs[memberId]?.map((movie) => movie._id)
    );
    return movies.filter((movie) => !watchedMovieIds.has(movie._id));
  };

  if (loadingMembers || loadingMovies) return <div>Loading...</div>;
  if (errorMembers || errorMovies)
    return <div>Error: {errorMembers || errorMovies}</div>;

  // Check if the user has permission
  const hasAddMember = permissions.includes("Add Member");

  return (
    <div className="subscriptions-container">
      <h1>Members</h1>
      {hasAddMember && (
        <Link to="/AddMemberPage" className="add-member-button">
          Add Member
        </Link>
      )}
      <div className="members-grid">
        {members.map((member) => (
          <MemberItem
            key={member._id}
            member={member}
            watchedMovies={processedSubs[member._id] || []}
            availableMovies={getAvailableMoviesForMember(member._id)}
            handleMovieSelect={handleMovieSelect}
            handleDateSelect={handleDateSelect}
            handleSubscribe={handleSubscribe}
            handleDeleteSubscription={handleDeleteSubscription}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
