from SubscriptionsWS.DAL.MembersWS import MembersWS
from SubscriptionsWS.DAL.SubscriptionsDB import SubscriptionsDB
from bson import ObjectId


class MembersBLL:
    def __init__(self):
        self.__membersWS = MembersWS()
        self.__subscriptions_DB = SubscriptionsDB()

    def add_member(self, name, email, city):
        try:
            # Call the DAL function to add a member
            result = self.__subscriptions_DB.add_member(name, email, city)

            # Check if the addition was successful
            if result:
                return {"success": "Member added successfully"}
            else:
                return {"error": "Failed to add member"}, 400
        except Exception as e:
            print(f"Error adding member: {e}")
            return {"error": str(e)}, 500

    def store_all_members(self):
        members = self.__membersWS.get_all_members()
        members = list(
            map(
                lambda member: {
                    "id": (
                        str(member["id"])
                        if "id" in member and isinstance(member["id"], ObjectId)
                        else member["id"]
                    ),
                    "name": member["name"],
                    "email": member["email"],
                    "city": member["address"]["city"],
                },
                members,
            )
        )
        # Check if Members collection already has data
        if self.__subscriptions_DB.has_members():
            print("Members collection already populated.")

        else:
            self.__subscriptions_DB.insert_members(members)

    def get_all_members(self):
        members = self.__subscriptions_DB.get_all_members()
        return members

    def get_member_by_id(self, _id):
        # Fetch member details from the database
        member = self.__subscriptions_DB.get_member_by_id(_id)
        if not member:
            return None

        # Process and return the member data

        return {
            "_id": str(member["_id"]),
            "name": member["name"],
            "email": member["email"],
            "city": member.get(
                "city", "Not Provided"
            ),  # Using .get() in case city is not present
        }

    def update_member(self, _id, name, email, city):
        # Update the member details in the database directly using the string _id
        result = self.__subscriptions_DB.update_member(_id, name, email, city)
        if result:
            return {"success": "Member updated successfully"}
        else:
            return {
                "error": "Member could not be updated"
            }, 400  # Use "error" and include a status code

    def delete_member(self, _id):
        # Delete the member from the database directly using the string _id
        result = self.__subscriptions_DB.delete_member(_id)
        if result:
            return {"success": "Member deleted successfully"}
        else:
            return {
                "error": "Member could not be deleted"
            }, 400  # Use "error" and include a status code
