"""
Sleep Stress Loop – Flask Backend
Run: python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity,
)
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import bcrypt
import pickle
import numpy as np
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ── JWT config ────────────────────────────────────────────────────────────────
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)

# ── MongoDB ───────────────────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/sleepstress")
client = MongoClient(MONGO_URI)
db = client.get_default_database()
users_col = db["users"]
data_col = db["user_data"]

# Create unique index on email
users_col.create_index("email", unique=True)

# ── Load ML model ─────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "stress_model.pkl")
try:
    with open(MODEL_PATH, "rb") as f:
        model_bundle = pickle.load(f)
    pipeline = model_bundle["pipeline"]
    FEATURES = model_bundle["features"]
    print(f"✅ Model loaded. Features: {FEATURES}")
except FileNotFoundError:
    pipeline = None
    FEATURES = []
    print("⚠️  stress_model.pkl not found. Run train_model.py first.")


# ── Helpers ───────────────────────────────────────────────────────────────────
def serialize(doc):
    """Convert MongoDB ObjectId to string for JSON serialization."""
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


def validate_sleep_inputs(data):
    errors = {}
    sleep = data.get("sleep_duration_hrs", 0)
    deep = data.get("deep_sleep_pct", 0)

    if not (3 <= sleep <= 12):
        errors["sleep_duration_hrs"] = "Sleep duration must be between 3 and 12 hours."
    if not (0 <= deep <= 100):
        errors["deep_sleep_pct"] = "Deep sleep % must be between 0 and 100."
    if not (50 <= data.get("heart_rate_bpm", 60) <= 180):
        errors["heart_rate_bpm"] = "Heart rate must be between 50 and 180 bpm."
    if not (80 <= data.get("spo2_pct", 95) <= 100):
        errors["spo2_pct"] = "SpO2 must be between 80 and 100%."
    if not (0 <= data.get("times_woke", 0) <= 20):
        errors["times_woke"] = "Times woke must be between 0 and 20."
    if not (0 <= data.get("activity_steps", 0) <= 50000):
        errors["activity_steps"] = "Steps must be between 0 and 50,000."
    if not (1 <= data.get("sleep_quality_1_10", 5) <= 10):
        errors["sleep_quality_1_10"] = "Sleep quality must be between 1 and 10."
    return errors


# ── Auth routes ───────────────────────────────────────────────────────────────
@app.route("/api/signup", methods=["POST"])
def signup():
    body = request.get_json()
    username = body.get("username", "").strip()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    user = {
        "username": username,
        "email": email,
        "password_hash": hashed,
        "created_at": datetime.utcnow(),
    }
    try:
        result = users_col.insert_one(user)
        token = create_access_token(identity=str(result.inserted_id))
        return jsonify({"token": token, "username": username}), 201
    except DuplicateKeyError:
        return jsonify({"error": "Email already registered."}), 409


@app.route("/api/login", methods=["POST"])
def login():
    body = request.get_json()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")

    user = users_col.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode(), user["password_hash"]):
        return jsonify({"error": "Invalid email or password."}), 401

    token = create_access_token(identity=str(user["_id"]))
    return jsonify({"token": token, "username": user["username"]}), 200


@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = users_col.find_one({"_id": ObjectId(uid)}, {"password_hash": 0})
    return jsonify(serialize(user)), 200


# ── Prediction route ───────────────────────────────────────────────────────────
@app.route("/api/predict", methods=["POST"])
@jwt_required()
def predict():
    if pipeline is None:
        return jsonify({"error": "Model not loaded. Run train_model.py first."}), 503

    body = request.get_json()

    # Cast to correct types
    try:
        input_data = {
            "heart_rate_bpm": float(body["heart_rate_bpm"]),
            "spo2_pct": float(body["spo2_pct"]),
            "sleep_duration_hrs": float(body["sleep_duration_hrs"]),
            "sleep_quality_1_10": float(body["sleep_quality_1_10"]),
            "times_woke": int(body["times_woke"]),
            "deep_sleep_pct": float(body["deep_sleep_pct"]),
            "activity_steps": int(body["activity_steps"]),
        }
    except (KeyError, ValueError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    errors = validate_sleep_inputs(input_data)
    if errors:
        return jsonify({"errors": errors}), 422

    X = np.array([[input_data[f] for f in FEATURES]])
    raw_score = pipeline.predict(X)[0]
    score = float(np.clip(round(raw_score), 1, 100))

    if score <= 33:
        category = "Low"
        interpretation = "Your stress levels look healthy! Keep up the good sleep habits."
    elif score <= 66:
        category = "Moderate"
        interpretation = "Moderate stress detected. Consider improving sleep duration or reducing nighttime awakenings."
    else:
        category = "High"
        interpretation = "High stress detected! Prioritise rest, limit stimulants, and try relaxation techniques."

    return jsonify({
        "stress_score": score,
        "stress_category": category,
        "interpretation": interpretation,
    }), 200


# ── Push / Retrieve data ──────────────────────────────────────────────────────
@app.route("/api/push-data", methods=["POST"])
@jwt_required()
def push_data():
    uid = get_jwt_identity()
    body = request.get_json()

    record = {
        "user_id": uid,
        "input_features": body.get("input_features", {}),
        "predicted_stress": body.get("predicted_stress"),
        "stress_category": body.get("stress_category"),
        "hrv": body.get("hrv"),          # extra manual field, stored but not used by model
        "timestamp": datetime.utcnow(),
    }
    data_col.insert_one(record)
    return jsonify({"message": "Data saved successfully."}), 201


@app.route("/api/retrieve-data", methods=["GET"])
@jwt_required()
def retrieve_data():
    uid = get_jwt_identity()
    latest = data_col.find_one(
        {"user_id": uid},
        sort=[("timestamp", -1)]
    )
    if not latest:
        return jsonify({"data": None}), 200
    return jsonify({"data": serialize(latest)}), 200


@app.route("/api/history", methods=["GET"])
@jwt_required()
def history():
    uid = get_jwt_identity()
    cursor = data_col.find(
        {"user_id": uid},
        sort=[("timestamp", -1)],
        limit=30
    )
    records = [serialize(r) for r in cursor]
    # Reverse for chronological order in charts
    records.reverse()
    return jsonify({"history": records}), 200


# ── Health check ───────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": pipeline is not None}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)