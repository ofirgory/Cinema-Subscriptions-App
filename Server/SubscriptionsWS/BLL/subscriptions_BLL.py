from SubscriptionsWS.DAL.SubscriptionsDB import SubscriptionsDB
from bson import ObjectId


class SubscriptionsBLL:
    def __init__(self):
        self.subscriptions_db = SubscriptionsDB()

    def add_subscription(self, member_id, movie_id, watch_date):
        # Call the method from the SubscriptionsDB class
        result = self.subscriptions_db.add_or_update_subscription(
            member_id, movie_id, watch_date
        )
        return result

    def get_all_subscriptions(self):
        try:
            # Call the corresponding DAL function to fetch all subscriptions
            subscriptions = self.subscriptions_db.get_all_subscriptions()
            return subscriptions
        except Exception as e:
            print(f"Error in get_all_subscriptions: {e}")
            return None

    def delete_subscription(self, member_id, movie_id):
        try:
            # Call the corresponding DAL function to delete a subscription
            result = self.subscriptions_db.delete_subscription(member_id, movie_id)
            return result
        except Exception as e:
            print(f"Error in delete_subscription: {e}")
            return False
