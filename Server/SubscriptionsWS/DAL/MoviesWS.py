import requests


class MoviesWS:
    def __init__(self):
        self.__url = "https://api.tvmaze.com/shows"

    def get_all_movies(self):
        resp = requests.get(self.__url)
        movies = resp.json()[:50]  # Limit the results to the first 50 movies
        return movies
