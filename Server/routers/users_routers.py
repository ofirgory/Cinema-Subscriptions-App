from flask import Blueprint, request, jsonify
from CinemaWS.DAL.usersDB import UsersDB
from CinemaWS.BLL.users_bll import UsersBLL
from CinemaWS.DAL.users_file import UsersFile
from bson import ObjectId


login_router = Blueprint("login", __name__)
users_router = Blueprint("users", __name__)
permissions_router = Blueprint("permissions", __name__)
users_db = UsersDB()
users_bll = UsersBLL()
users_data_access = UsersFile()


@login_router.route("/login", methods=["POST"])
def login():
    username = request.json.get("UserName")
    password = request.json.get("Password")
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    login_success, user = users_db.login(username, password)
    if login_success:
        user_id = str(user["_id"])  # Convert ObjectId to string if using MongoDB
        permissions = users_data_access.get_permissions_by_user_id(user_id)
        user_details = {
            "id": user_id,
            "firstName": user.get("FirstName"),
            "permissions": permissions,
        }
        return jsonify({"message": "Login successful", "user": user_details}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@users_router.route("/admin_create_user", methods=["POST"])
def admin_create_user():
    # Extract user details from the request
    username = request.json.get("username")
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")

    # Validate required fields without permissions
    if not all([username, first_name, last_name]):
        return jsonify({"error": "Missing one or more user details"}), 400

    # Create user using BLL
    create_msg = users_bll.admin_create_user(username, first_name, last_name)

    if "successfully" in create_msg:
        return jsonify({"message": create_msg}), 201
    else:
        return jsonify({"error": create_msg}), 400


@users_router.route("/set_password", methods=["POST"])
def set_user_password():
    print(request.json)
    data = request.json
    username = data.get("username")
    new_password = data.get("new_password")
    ...
    if users_bll.set_password(username, new_password):
        return jsonify({"message": "Password updated successfully"}), 200
    else:
        return (
            jsonify({"error": "Failed to update password or username does not exist"}),
            400,
        )


@users_router.route("/api/users", methods=["GET"])
def api_get_users():
    users = users_db.get_all_users()

    return jsonify(users)


@users_router.route("/api/users/<user_id>", methods=["GET"])
def get_user_by_id(user_id):
    user = users_db.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Convert ObjectId to string before returning
    user["_id"] = str(user["_id"])

    return jsonify(user)


@users_router.route("/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    # Delete the user using the permissions_routerropriate method from your data access layer
    delete_success = users_bll.delete_user(user_id)
    if delete_success:
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"error": "Failed to delete user"}), 400


@users_router.route("/api/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    # Validate user_id
    if not user_id:
        return jsonify({"error": "Missing user ID"}), 400

    # Extract updated user details from the request
    updated_user = request.json

    # Validate required fields
    if not updated_user:
        return jsonify({"error": "Missing updated user details"}), 400

    # Update the user using the permissions_routerropriate method from your data access layer
    try:
        update_success = users_bll.update_user(user_id, updated_user)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    if update_success:
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update user"}), 400


## Permissions Routers ##


# Fetch permissions


@permissions_router.route("/permissions", methods=["GET"])
def fetch_permissions():
    try:
        permissions = users_bll.get_permissions()
        return jsonify({"data": permissions}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch permissions", "details": str(e)}), 500


@permissions_router.route("/permissions/<_id>", methods=["GET"])
def fetch_permission_by_id(_id):
    try:
        permission = users_bll.get_permissions_by_id(_id)
        if permission:
            return (
                jsonify(
                    {"message": "Permission fetched successfully", "data": permission}
                ),
                200,
            )
        else:
            return jsonify({"message": "Permission not found"}), 404
    except Exception as e:
        return (
            jsonify(
                {
                    "message": "An error occurred while fetching permission",
                    "error": str(e),
                }
            ),
            500,
        )


# Update permission
@permissions_router.route("/permissions/<_id>", methods=["PUT"])
def update_permission(_id):
    new_permissions = request.json
    response, status_code = users_bll.update_permission(_id, new_permissions)
    return jsonify(response), status_code


# Delete permission
@permissions_router.route("/permissions/<_id>", methods=["DELETE"])
def delete_permission(_id):
    response, status_code = users_bll.delete_permission(_id)
    return jsonify(response), status_code
