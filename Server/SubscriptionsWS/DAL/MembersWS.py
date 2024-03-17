import requests


class MembersWS:
    def __init__(self):
        self.__url = "https://jsonplaceholder.typicode.com/users"

    def get_all_members(self):
        resp = requests.get(self.__url)
        return resp.json()
