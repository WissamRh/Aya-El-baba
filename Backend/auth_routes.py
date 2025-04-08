from flask import Blueprint, request, jsonify
from model.user import User
from db import db
import jwt
import datetime

auth_routes = Blueprint("auth", __name__)

SECRET_KEY = "secret-key" 

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "sub": user.id,
        "username": user.username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return jsonify({"token": token})



@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "User already exists"}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": f"User '{username}' created"}), 201