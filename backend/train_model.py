"""
Train and save the stress prediction model from sleep_stress_dataset.csv
Run: python train_model.py
Output: stress_model.pkl
"""

import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

# ── Load dataset ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "sleep_stress_dataset.csv")

df = pd.read_csv(DATA_PATH)
print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# ── Feature selection (matches form inputs) ───────────────────────────────────
FEATURES = [
    "heart_rate_bpm",
    "spo2_pct",
    "sleep_duration_hrs",
    "sleep_quality_1_10",
    "times_woke",
    "deep_sleep_pct",
    "activity_steps",
]
TARGET = "stress_score"

df = df.dropna(subset=FEATURES + [TARGET])
X = df[FEATURES]
y = df[TARGET]

print(f"Training features: {FEATURES}")
print(f"Target: {TARGET}")
print(f"Samples after cleaning: {len(X)}")

# ── Train/test split ──────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── Build pipeline ────────────────────────────────────────────────────────────
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LinearRegression()),
])

pipeline.fit(X_train, y_train)

# ── Evaluate ──────────────────────────────────────────────────────────────────
y_pred = pipeline.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"\nModel Evaluation:")
print(f"  MAE : {mae:.2f}")
print(f"  R²  : {r2:.4f}")

# ── Save model ────────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(BASE_DIR, "stress_model.pkl")
with open(MODEL_PATH, "wb") as f:
    pickle.dump({"pipeline": pipeline, "features": FEATURES}, f)

print(f"\n✅  Model saved to: {MODEL_PATH}")