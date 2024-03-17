from SubscriptionsWS.DAL.MoviesWS import MoviesWS
from SubscriptionsWS.DAL.SubscriptionsDB import SubscriptionsDB
from bson import ObjectId


class MoviesBLL:
    def __init__(self):
        self.__moviesWS = MoviesWS()
        self.__movies_DB = SubscriptionsDB()

    def add_movie(self, name, genres, image, premiered):
        # Validate input data as needed
        if not name or not genres or not image or not premiered:
            print("Invalid movie data provided.")
            return False

        # Attempt to add the movie to the database
        success = self.__movies_DB.add_movie(name, genres, image, premiered)

        if success:
            print(f"Movie '{name}' added successfully.")
            return True
        else:
            print(f"Failed to add movie '{name}'.")
            return False

    def store_all_movies(self):
        movies = self.__moviesWS.get_all_movies()
        movies = list(
            map(
                lambda movie: {
                    "id": (
                        str(movie["id"])
                        if "id" in movie and isinstance(movie["id"], ObjectId)
                        else movie["id"]
                    ),
                    "name": movie["name"],
                    "genres": movie["genres"],
                    "image": movie["image"]["medium"],
                    "premiered": movie["premiered"],
                },
                movies,
            )
        )
        # Check if Movies collection already has data
        if self.__movies_DB.has_movies():
            print("Movies collection already populated.")

        else:
            self.__movies_DB.insert_movies(movies)

    def get_all_movies(self):
        movies = self.__movies_DB.get_all_movies()
        return movies

    def delete_movie(self, movie_id):
        movie = self.__movies_DB.delete_movie(movie_id)
        return movie

    def get_movie_by_id(self, movie_id):
        # You might want to add additional validation or transformation logic here
        movie = self.__movies_DB.get_movie_by_id(movie_id)
        if movie:
            # Example transformation or additional business logic could go here
            # For now, we'll just return the movie as is
            return movie
        else:
            print(f"No movie found with ID {movie_id}.")
            return None

    def update_movie(self, movie_id, name, genres, image, premiered):
        # You can add any validation or additional business logic here
        return self.__movies_DB.update_movie(movie_id, name, genres, image, premiered)
