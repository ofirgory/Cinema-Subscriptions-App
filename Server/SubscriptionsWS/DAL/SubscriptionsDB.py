from flask import jsonify
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime


class SubscriptionsDB:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["SubscriptionsDB"]
        self.__members_collection = self.__db["Members"]
        self.__movies_collection = self.__db["Movies"]
        self.__subscriptions_collection = self.__db["Subscriptions"]

    def __convert_to_object_id(self, id_str):
        try:
            return ObjectId(id_str)
        except:
            return None

    def __convert_document_id(self, document):
        return {
            k: str(v) if isinstance(v, ObjectId) else v for k, v in document.items()
        }

    #### Members Functions ####
    def add_member(self, name, email, city):
        try:
            # Create a new member document
            member_document = {
                "name": name,
                "email": email,
                "city": city,
                "created_at": datetime.now(),
            }

            # Insert the new member document into the Members collection
            result = self.__members_collection.insert_one(member_document)

            # Check if the insertion was successful
            if result.inserted_id:
                return True
            else:
                return False
        except Exception as e:
            print(f"Error adding member: {e}")
            return False

    def insert_members(self, members):
        if members:
            self.__members_collection.insert_many(members)
            print("Members inserted to Members collection!")

    def get_all_members(self):
        members = list(self.__members_collection.find())
        # Convert ObjectId to string for all member documents
        members = [
            {k: str(v) if isinstance(v, ObjectId) else v for k, v in member.items()}
            for member in members
        ]
        return members

    def has_members(self):
        # Check if there is at least one document in the Members collection
        return self.__members_collection.find_one() is not None

    def get_member_by_id(self, member_id):
        # Attempt to convert the member_id to ObjectId, handle the case where it's not a valid ObjectId
        try:
            oid = ObjectId(member_id)
        except:
            return None

        # Query the database for the member
        member = self.__members_collection.find_one({"_id": oid})

        # Convert ObjectId to string for the member document, if the member is found
        if member:
            return {
                k: str(v) if isinstance(v, ObjectId) else v for k, v in member.items()
            }
        else:
            return None

    def update_member(self, member_id, name, email, city):
        # Convert the member_id to an ObjectId
        member_oid = self.__convert_to_object_id(member_id)

        # Update the member document in the Members collection
        update_result = self.__members_collection.update_one(
            {"_id": member_oid},
            {
                "$set": {
                    "name": name,
                    "email": email,
                    "city": city,
                }
            },
        )

        # Check if the update was successful
        if update_result.matched_count > 0:
            return True
        else:
            return False

    def delete_member(self, member_id):
        # Convert the member_id to an ObjectId
        member_oid = self.__convert_to_object_id(member_id)
        # Delete the member document from the Members collection
        delete_result = self.__members_collection.delete_one({"_id": member_oid})
        # Check if the delete was successful
        if delete_result.deleted_count > 0:
            return True
        else:
            return False

    #### Movies Functions ####

    def add_movie(self, name, genres, image, premiered):
        try:
            # Format premiered date to YYYY-MM-DD string
            premiered_formatted = datetime.strptime(premiered, "%Y-%m-%d").strftime(
                "%Y-%m-%d"
            )

            movie_document = {
                "name": name,
                "genres": genres,
                "image": image,
                "premiered": premiered_formatted,  # Use formatted string
            }

            result = self.__movies_collection.insert_one(movie_document)
            if result.inserted_id:
                return True
            else:
                return False
        except Exception as e:
            print(f"Error adding movie: {e}")
            return False

    def insert_movies(self, movies):
        if movies:
            self.__movies_collection.insert_many(movies)
            print("Movies inserted to Movies collection!")

    def get_all_movies(self):
        movies_query = self.__movies_collection.find()

        movies = list(movies_query)
        # Convert ObjectId to string for all movies documents
        movies = [
            {k: str(v) if isinstance(v, ObjectId) else v for k, v in movie.items()}
            for movie in movies
        ]
        return movies

    def has_movies(self):
        # Check if there is at least one document in the Movies collection
        return self.__movies_collection.find_one() is not None

    def get_movie_by_id(self, movie_id):
        oid = self.__convert_to_object_id(movie_id)
        if oid is None:
            print("Invalid movie_id format.")
            return None

        movie = self.__movies_collection.find_one({"_id": oid})
        if movie:
            return self.__convert_document_id(movie)
        else:
            print(f"No movie found with ID {movie_id}.")
            return None

    def delete_movie(self, movie_id):
        try:
            # Convert the movie_id to an ObjectId
            oid = ObjectId(movie_id)
        except:
            print("Invalid movie_id format.")
            return False

        # Attempt to delete the movie
        result = self.__movies_collection.delete_one({"_id": oid})

        # Check if a movie was deleted
        if result.deleted_count > 0:
            print(f"Movie with ID {movie_id} deleted successfully.")
            return True
        else:
            print(f"No movie found with ID {movie_id}.")
            return False

    def update_movie(self, movie_id, name, genres, image, premiered):
        oid = self.__convert_to_object_id(movie_id)
        if oid is None:
            print("Invalid movie_id format.")
            return False

        # Format premiered date to YYYY-MM-DD string
        premiered_formatted = datetime.strptime(premiered, "%Y-%m-%d").strftime(
            "%Y-%m-%d"
        )

        update_result = self.__movies_collection.update_one(
            {"_id": oid},
            {
                "$set": {
                    "name": name,
                    "genres": genres,
                    "image": image,
                    "premiered": premiered_formatted,  # Use formatted string
                }
            },
        )

        if update_result.matched_count > 0:
            return True
        else:
            return False

    #### Subscriptions Functions ####
    def __format_date(self, date_str):

        # Assuming the date is in 'yyyy-mm-dd' format as it's more common. Adjust if needed.
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        return date_obj.strftime("%d/%m/%Y")

    def add_or_update_subscription(self, member_id, movie_id, watch_date):
        member_oid = self.__convert_to_object_id(member_id)
        movie_oid = self.__convert_to_object_id(movie_id)
        if not member_oid or not movie_oid:
            return False

        # Format the watch_date before storing it
        formatted_watch_date = self.__format_date(watch_date)

        member = self.__members_collection.find_one({"_id": member_oid})
        if not member:
            return False

        result = self.__subscriptions_collection.update_one(
            {"member_id": member_oid},
            {
                "$setOnInsert": {
                    "member_id": member_oid,
                    "member_info": self.__convert_document_id(member),
                },
                "$push": {
                    "movies": {
                        "movie_id": movie_oid,
                        "watch_date": formatted_watch_date,
                    }
                },
            },
            upsert=True,
        )

        # Check if the operation is successful
        return result.matched_count > 0 or result.upserted_id is not None

    def get_all_subscriptions(self):
        try:
            subscriptions = list(self.__subscriptions_collection.find())
            # Convert ObjectId to string for all subscription documents
            return [
                {
                    k: str(v) if isinstance(v, ObjectId) else v
                    for k, v in subscription.items()
                }
                for subscription in subscriptions
            ]
        except Exception as e:
            print(f"Error fetching subscriptions: {e}")
            return None

    def delete_subscription(self, member_id, movie_id):
        try:
            member_oid = ObjectId(member_id)
            movie_oid = ObjectId(movie_id)
        except:
            return False  # Invalid ObjectId

        # Specify both "member_id" and "movies.movie_id" in the filter
        result = self.__subscriptions_collection.delete_one(
            {"member_id": member_oid, "movies.movie_id": movie_oid}
        )

        return result.deleted_count > 0
