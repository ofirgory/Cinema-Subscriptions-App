from pymongo import MongoClient
from bson import ObjectId


class UsersDB:
    def __init__(self):
        self.__client = MongoClient("mongodb://localhost:27017/")
        self.__db = self.__client["UsersDB"]
        self.__users_collection = self.__db["LoginDetails"]

    def get_all_users(self):
        try:
            users = list(self.__users_collection.find())
            return [
                {k: str(v) if isinstance(v, ObjectId) else v for k, v in user.items()}
                for user in users
            ]
        except Exception as e:
            print(f"An error occurred: {e}")
            return []

    def login(self, username, password):
        try:
            user = self.__users_collection.find_one(
                {"UserName": username, "Password": password}
            )
            return bool(user), user
        except Exception as e:
            print(f"Login error: {e}")
            return False, None

    def user_exists(self, username):
        return bool(self.__users_collection.find_one({"UserName": username}))

    def add_user(self, obj):
        if not self.user_exists(obj["UserName"]):
            result = self.__users_collection.insert_one(obj)
            print("User created successfully!")
            return str(result.inserted_id)
        else:
            print("User already exists.")
            return None

    def update_user(self, user_id, updates):
        try:
            # Remove _id and permissions from updates if they exist
            updates.pop("_id", None)
            updates.pop("permissions", None)

            result = self.__users_collection.update_one(
                {"_id": ObjectId(user_id)}, {"$set": updates}
            )
            if result.modified_count > 0:
                print("User updated successfully!")
            else:
                print("No user found with the given id")
        except Exception as e:
            print(f"Update error: {e}")

    def delete_user(self, user_id):
        try:
            result = self.__users_collection.delete_one({"_id": ObjectId(user_id)})
            if result.deleted_count > 0:
                print("User deleted successfully!")
                return True
            else:
                print("No user found with the given id")
                return False
        except Exception as e:
            print(f"Delete error: {e}")
            return False

    def update_password(self, username, new_password):
        result = self.__users_collection.update_one(
            {"UserName": username}, {"$set": {"Password": new_password}}
        )
        return (
            result.modified_count > 0
        )  # True if the password was updated, False otherwise

    def get_user_by_id(self, user_id):
        try:
            user = self.__users_collection.find_one({"_id": ObjectId(user_id)})
            return user
        except Exception as e:
            print(f"Error retrieving user: {e}")
            return None
