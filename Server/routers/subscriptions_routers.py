from flask import Blueprint, jsonify, request
from SubscriptionsWS.BLL.MoviesBLL import MoviesBLL
from SubscriptionsWS.BLL.members_BLL import MembersBLL
from SubscriptionsWS.BLL.subscriptions_BLL import SubscriptionsBLL
from bson import ObjectId

members = Blueprint("members", __name__)
movies = Blueprint("movies", __name__)
subscriptions = Blueprint("subscriptions", __name__)

membersBLL = MembersBLL()
moviesBLL = MoviesBLL()
subscriptionsBLL = SubscriptionsBLL()

## Members Routers ##


@members.route("/store", methods=["POST"])
def store_all_members():
    members = membersBLL.store_all_members()
    return jsonify(members)


@members.route("/", methods=["GET"])
def get_all_members():
    try:
        members = membersBLL.get_all_members()
        return jsonify(members)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@members.route("/<_id>", methods=["GET"])
def get_member_by_id(_id):
    try:
        member = membersBLL.get_member_by_id(_id)
        if member:
            return jsonify(member)
        else:
            return jsonify({"message": "Member not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@members.route("/add", methods=["POST"])
def add_member():
    try:
        data = request.json
        print("Received Data:", data)  # Add this line for debugging

        name = data.get("name")
        email = data.get("email")
        city = data.get("city")

        result = membersBLL.add_member(name, email, city)
        if result:
            return jsonify({"success": "Member added successfully"}), 200
        else:
            return jsonify({"error": "Failed to add member"}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@members.route("/update/<_id>", methods=["PUT"])
def update_member(_id):
    try:
        data = request.json
        result = membersBLL.update_member(_id, **data)
        if result.get("success"):
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        print(f"Error updating member: {e}")
        return jsonify({"error": str(e)}), 500


@members.route("/delete/<_id>", methods=["DELETE"])
def delete_member(_id):
    try:
        result = membersBLL.delete_member(_id)
        if result.get("success"):
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        print(f"Error deleting member: {e}")
        return jsonify({"error": str(e)}), 500


## Movies Routers ##


@movies.route("/store", methods=["POST"])
def store_all_movies():
    movies = moviesBLL.store_all_movies()
    return jsonify(movies)


@movies.route("/", methods=["GET"])
def get_all_movies():
    try:
        movies = moviesBLL.get_all_movies()
        return jsonify(movies)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@movies.route("/<movie_id>", methods=["GET"])
def get_movie(movie_id):
    movie = moviesBLL.get_movie_by_id(movie_id)
    if movie:
        return jsonify(movie), 200
    else:
        return jsonify({"error": "Movie not found"}), 404


@movies.route("/add", methods=["POST"])
def add_movie():
    try:
        # Extract movie data from the request's body
        data = request.json
        name = data.get("name")
        genres = data.get("genres")
        image = data.get("image")
        premiered = data.get("premiered")

        # Validate required fields
        if not all([name, genres, image, premiered]):
            return jsonify({"error": "Missing required movie data"}), 400

        # Call the BLL method to add the movie
        result = moviesBLL.add_movie(name, genres, image, premiered)

        if result:
            return jsonify({"success": "Movie added successfully"}), 201
        else:
            return jsonify({"error": "Failed to add movie"}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@movies.route("/<movie_id>", methods=["DELETE"])
def delete_movie(movie_id):
    try:
        # Call the BLL method to delete the movie by its ID
        result = moviesBLL.delete_movie(movie_id)

        if result:
            return jsonify({"success": "Movie deleted successfully"}), 200
        else:
            return jsonify({"error": "Failed to delete movie or movie not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@movies.route("/<movie_id>", methods=["PUT"])
def update_movie(movie_id):
    try:
        data = request.json
        name = data.get("name")
        genres = data.get("genres")
        image = data.get("image")
        premiered = data.get("premiered")

        # Validate required fields
        if not all([name, genres, image, premiered]):
            return jsonify({"error": "Missing required movie data"}), 400

        # Call the BLL method to update the movie
        result = moviesBLL.update_movie(movie_id, name, genres, image, premiered)

        if result:
            return jsonify({"success": "Movie updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update movie or movie not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


## Subscriptions Routers##


@subscriptions.route("/add", methods=["POST"])
def add_subscription():
    try:
        data = request.json
        print("Received Data:", data)  # For debugging

        # Extracting and converting member_id
        member_id_str = data.get("member_id", {}).get("$oid")
        if not member_id_str:
            return jsonify({"error": "Invalid member_id"}), 400
        member_id = ObjectId(member_id_str)

        # Assuming there's only one movie being added at a time for simplicity
        movie_data = data.get("movies", [{}])[0]
        movie_id_str = movie_data.get("movie_id", {}).get("$oid")
        if not movie_id_str:
            return jsonify({"error": "Invalid movie_id"}), 400
        movie_id = ObjectId(movie_id_str)

        watch_date = movie_data.get("watch_date")

        # Proceed with your logic, assuming it expects ObjectId instances
        result = subscriptionsBLL.add_subscription(member_id, movie_id, watch_date)
        if result:
            return jsonify({"success": "Subscription added successfully"}), 200
        else:
            return jsonify({"error": "Failed to add subscription"}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@subscriptions.route("/all", methods=["GET"])
def get_all_subscriptions():
    try:
        all_subscriptions = subscriptionsBLL.get_all_subscriptions()

        # Convert ObjectId to strings before returning the response
        converted_subscriptions = []
        for subscription in all_subscriptions:
            subscription["_id"] = str(subscription["_id"])  # Convert _id field
            subscription["member_id"] = str(
                subscription["member_id"]
            )  # Convert member_id field
            # Convert movie_id field within each movie document
            for movie in subscription["movies"]:
                movie["movie_id"] = str(movie["movie_id"])
            converted_subscriptions.append(subscription)

        if converted_subscriptions is not None:
            return jsonify(converted_subscriptions), 200
        else:
            return jsonify({"error": "Failed to fetch subscriptions"}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@subscriptions.route("/delete/<member_id>/<movie_id>", methods=["DELETE"])
def delete_subscription(member_id, movie_id):
    try:
        result = subscriptionsBLL.delete_subscription(member_id, movie_id)
        if result:
            return jsonify({"success": "Subscription deleted successfully"}), 200
        else:
            return jsonify({"error": "Failed to delete subscription"}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
