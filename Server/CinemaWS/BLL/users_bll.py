from CinemaWS.DAL.users_file import UsersFile
from CinemaWS.DAL.usersDB import UsersDB
from datetime import datetime


class UsersBLL:
    def __init__(self):
        self.__users_file = UsersFile()
        self.__users_db = UsersDB()

    def set_password(self, username, new_password):
        return self.__users_db.update_password(username, new_password)

    def admin_create_user(self, username, first_name, last_name):
        # Create the user object
        user_obj = {
            "UserName": username,
            "Password": "",
            "FirstName": first_name,
            "LastName": last_name,
            "CreationDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

        # Attempt to add user to MongoDB and capture the user ID
        user_id = self.__users_db.add_user(user_obj)

        if not user_id:
            return "User creation failed or user already exists."

        # Update user details in the users JSON file
        users = self.__users_file.get_users()
        users.append(
            {
                "_id": user_id,
                "UserName": username,
                "FirstName": first_name,
                "LastName": last_name,
                "CreatedDate": user_obj["CreationDate"],
            }
        )
        self.__users_file.set_users(users)

        # Use the new DAL function to create an empty permissions object for the new user
        self.__users_file.add_empty_permissions_for_user(user_id)

        return "User created successfully with ID: " + user_id

    def delete_user(self, username):
        # Get the user ID from the users DB
        user_id = self.__users_db.get_user_by_id(username)

        if not user_id:
            return "User not found."

        # Delete the user from the users DB
        self.__users_db.delete_user(user_id)

        # Delete the user from the users file
        users = self.__users_file.get_users()
        users = [user for user in users if user["_id"] != user_id]
        self.__users_file.set_users(users)

        # Delete the user's permissions from the permissions file
        permissions_data = self.__users_file.get_permissions()
        permissions_data = [
            permission
            for permission in permissions_data
            if permission["_id"] != user_id
        ]
        self.__users_file.set_permissions(permissions_data)

        return "User deleted successfully."

    def update_user(self, user_id, new_data):
        # Get the user ID from the users DB
        user = self.__users_db.get_user_by_id(user_id)

        if not user:
            raise ValueError("User not found.")

        # Update user details in the users DB
        self.__users_db.update_user(user_id, new_data)

        # Update user details in the users file
        users = self.__users_file.get_users()
        for user in users:
            if user["_id"] == user_id:
                user.update(new_data)
                break
        self.__users_file.set_users(users)

        return "User updated successfully."

    def get_permissions(self):
        return self.__users_file.get_permissions()

    def get_permissions_by_id(self, _id):
        all_permissions = self.__users_file.get_permissions()
        # Assuming all_permissions is a list of dictionaries, each representing a user's permissions
        for permission in all_permissions:
            if permission["_id"] == _id:
                return permission  # Return the matching permission entry
        return None  # Return None or an appropriate response if no match is found

    def update_permission(self, user_id, new_permissions):
        permissions_data = self.__users_file.get_permissions()
        updated = False
        for permission in permissions_data:
            if str(permission["_id"]) == str(user_id):  # Ensure string comparison
                permission["permissions"] = new_permissions
                updated = True
                break
        if updated:
            # Correctly pass user_id and new_permissions to set_permissions
            self.__users_file.set_permissions(user_id, new_permissions)
            return {"message": "Permission updated successfully."}, 200
        else:
            return {"error": "User ID not found."}, 404

    def delete_permission(self, user_id):
        permissions_data = self.__users_file.get_permissions()
        original_length = len(permissions_data)
        permissions_data = [
            permission
            for permission in permissions_data
            if str(permission["_id"]) != str(user_id)
        ]  # Ensure string comparison
        if len(permissions_data) < original_length:
            self.__users_file.set_permissions(permissions_data)
            return {
                "message": "Permission deleted successfully."
            }, 200  # Adjusted for Flask response
        else:
            return {"error": "User ID not found."}, 404  # Adjusted for Flask response
