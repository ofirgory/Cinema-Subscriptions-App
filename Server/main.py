from flask import Flask
from flask_cors import CORS
from routers.subscriptions_routers import members, movies, subscriptions
from routers.users_routers import login_router, users_router, permissions_router


app = Flask(__name__)

CORS(app)

app.register_blueprint(login_router)
app.register_blueprint(members, url_prefix="/members")
app.register_blueprint(movies, url_prefix="/movies")
app.register_blueprint(subscriptions, url_prefix="/subscriptions")
app.register_blueprint(users_router)
app.register_blueprint(permissions_router)


app.run(debug=True, port=5173)
