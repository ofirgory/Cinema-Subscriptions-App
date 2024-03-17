import json
import os


class UsersFile:
    def __init__(self):
        self.__users_file = "C:/Users/Ofir/Desktop/Yaniv Arad - training labs/Cinema-Final Project 1/Server/CinemaWS/DATA/Users.json"
        self.__permissions_file = "C:/Users/Ofir/Desktop/Yaniv Arad - training labs/Cinema-Final Project 1/Server/CinemaWS/DATA/Permissions.json"

    def read_json(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, "r") as fp:
                return json.load(fp)
        else:
            return []

    def write_json(self, file_path, data):
        with open(file_path, "w") as fp:
            json.dump(data, fp, indent=4)

    def get_users(self):
        return self.read_json(self.__users_file)

    def get_user_by_id(self, user_id):
        users = self.get_users()  # Use the existing method to get all users

        # Search for the user with the matching ID
        for user in users:
            if (
                str(user.get("_id")) == user_id
            ):  # Ensure the ID types match (both as strings)
                return user

        # If no matching user is found, return None
        return None

    def set_users(self, data):
        self.write_json(self.__users_file, data)
        print("User details updated successfully!")

    def get_permissions(self):
        return self.read_json(self.__permissions_file)

    def get_permissions_by_user_id(self, user_id):
        # Load all permissions
        all_permissions = self.get_permissions()

        # Find permissions for the specified user ID
        user_permissions = next(
            (item for item in all_permissions if str(item.get("_id")) == str(user_id)),
            None,
        )

        if user_permissions is not None:
            return user_permissions.get("permissions", [])
        else:
            # Return an empty list if no permissions are found for the user
            return []

    def set_permissions(self, user_id, new_permissions):
        # Load the existing permissions
        permissions = self.read_json(self.__permissions_file)

        print(f"Setting permissions for user_id: {user_id}")

        # Find the user with the given _id
        for user in permissions:
            print(f"Checking user with _id: {user['_id']}")
            if str(user["_id"]) == user_id:  # Convert both to strings before comparing
                # Update the user's permissions
                user["permissions"] = new_permissions
                break
        else:
            print(f"No user found with _id: {user_id}")
            return

        # Write the updated permissions back to the file
        self.write_json(self.__permissions_file, permissions)
        print("Permissions updated successfully!")

    # Additional functionality to update a specific user's details or permissions might go here.
    # For simplicity, we are using the entire set/get approach.

    def delete_permissions(self, user_id):
        # Load the existing permissions
        permissions = self.read_json(self.__permissions_file)

        print(f"Deleting permissions for user_id: {user_id}")

        # Find the user with the given _id
        for user in permissions:
            print(f"Checking user with _id: {user['_id']}")
            if str(user["_id"]) == user_id:  # Convert both to strings before comparing
                # Delete the user's permissions
                del user["permissions"]
                break
        else:
            print(f"No user found with _id: {user_id}")
            return

        # Write the updated permissions back to the file
        self.write_json(self.__permissions_file, permissions)
        print("Permissions deleted successfully!")

    def add_empty_permissions_for_user(self, user_id):
        # Load the existing permissions
        permissions = self.get_permissions()

        # Check if the user already has permissions set (unlikely for new users, but good practice)
        existing_permission = next(
            (perm for perm in permissions if str(perm["_id"]) == str(user_id)), None
        )

        if existing_permission is not None:
            print(f"Permissions already exist for user_id: {user_id}")
            return  # Exit if permissions already exist

        # Add a new permissions entry for the user with an empty list
        permissions.append({"_id": user_id, "permissions": []})

        # Write the updated permissions back to the file
        self.write_json(self.__permissions_file, permissions)
        print(f"Empty permissions added successfully for user_id: {user_id}")
