from pathlib import Path
import json
import os


BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "progress_data.json"
CHARTS_DIR = BASE_DIR / "charts"
PUBLIC_CHARTS_DIR = BASE_DIR.parent / "public" / "charts"
OUTPUT_DIRS = [CHARTS_DIR, PUBLIC_CHARTS_DIR]

os.environ.setdefault("MPLCONFIGDIR", str(BASE_DIR / ".matplotlib-cache"))

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import pandas as pd


def load_data():
    if not DATA_FILE.exists():
        print(f"Missing data file: {DATA_FILE}")
        return {
            "dailyEntries": [],
            "projects": [],
            "roadmapItems": [],
            "weeklyReviews": [],
        }

    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except json.JSONDecodeError:
        print(f"Could not read JSON from: {DATA_FILE}")
        data = {}

    return {
        "dailyEntries": data.get("dailyEntries", []) or [],
        "projects": data.get("projects", []) or [],
        "roadmapItems": data.get("roadmapItems", []) or [],
        "weeklyReviews": data.get("weeklyReviews", []) or [],
    }


def save_empty_chart(filename, title, message="No data available"):
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.set_title(title)
    ax.text(0.5, 0.5, message, ha="center", va="center", fontsize=12)
    ax.set_axis_off()
    save_chart(fig, filename)


def save_chart(fig, filename):
    fig.tight_layout()

    for output_dir in OUTPUT_DIRS:
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / filename
        fig.savefig(output_path, dpi=150)
        print(f"Generated {output_path}")

    plt.close(fig)


def prepare_daily_entries(entries):
    df = pd.DataFrame(entries)

    if df.empty:
        return df

    defaults = {
        "date": "",
        "pomodoros": 0,
        "mood": None,
        "energy": None,
        "reactDone": False,
        "projectDone": False,
        "englishDone": False,
        "movementDone": False,
    }

    for column, default in defaults.items():
        if column not in df.columns:
            df[column] = default

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values("date")
    df["pomodoros"] = pd.to_numeric(df["pomodoros"], errors="coerce").fillna(0)
    df["mood"] = pd.to_numeric(df["mood"], errors="coerce")
    df["energy"] = pd.to_numeric(df["energy"], errors="coerce")

    for column in ["reactDone", "projectDone", "englishDone", "movementDone"]:
        df[column] = df[column].fillna(False).astype(bool)

    return df


def chart_pomodoro_per_day(daily_df):
    filename = "pomodoro_per_day.png"
    title = "Pomodoro per Day"

    if daily_df.empty:
        save_empty_chart(filename, title)
        return

    per_day = daily_df.groupby("date", as_index=False)["pomodoros"].sum()
    fig, ax = plt.subplots(figsize=(9, 4.8))
    ax.bar(per_day["date"].dt.strftime("%Y-%m-%d"), per_day["pomodoros"], color="#2dd4bf")
    ax.set_title(title)
    ax.set_xlabel("Date")
    ax.set_ylabel("Pomodoros")
    ax.tick_params(axis="x", rotation=45)
    save_chart(fig, filename)


def chart_weekly_pomodoro(daily_df):
    filename = "weekly_pomodoro.png"
    title = "Weekly Pomodoro"

    if daily_df.empty:
        save_empty_chart(filename, title)
        return

    weekly = (
        daily_df.set_index("date")
        .resample("W-MON", label="left", closed="left")["pomodoros"]
        .sum()
        .reset_index()
    )

    fig, ax = plt.subplots(figsize=(9, 4.8))
    ax.bar(weekly["date"].dt.strftime("%Y-%m-%d"), weekly["pomodoros"], color="#60a5fa")
    ax.set_title(title)
    ax.set_xlabel("Week starting")
    ax.set_ylabel("Pomodoros")
    ax.tick_params(axis="x", rotation=45)
    save_chart(fig, filename)


def chart_mood_energy_over_time(daily_df):
    filename = "mood_energy_over_time.png"
    title = "Mood and Energy Over Time"

    if daily_df.empty or daily_df[["mood", "energy"]].dropna(how="all").empty:
        save_empty_chart(filename, title)
        return

    per_day = daily_df.groupby("date", as_index=False)[["mood", "energy"]].mean()
    fig, ax = plt.subplots(figsize=(9, 4.8))
    ax.plot(per_day["date"], per_day["mood"], marker="o", label="Mood", color="#a78bfa")
    ax.plot(per_day["date"], per_day["energy"], marker="o", label="Energy", color="#4ade80")
    ax.set_title(title)
    ax.set_xlabel("Date")
    ax.set_ylabel("Score")
    ax.set_ylim(0, 10)
    ax.legend()
    ax.tick_params(axis="x", rotation=45)
    save_chart(fig, filename)


def chart_habit_heatmap(daily_df):
    filename = "habit_heatmap.png"
    title = "Habit Heatmap"
    habits = {
        "React": "reactDone",
        "Pet Project": "projectDone",
        "English": "englishDone",
        "Gym / Walk": "movementDone",
    }

    if daily_df.empty:
        save_empty_chart(filename, title)
        return

    per_day = daily_df.groupby("date", as_index=False)[list(habits.values())].max()
    heatmap = per_day.set_index(per_day["date"].dt.strftime("%Y-%m-%d"))[list(habits.values())]
    heatmap = heatmap.T.astype(int)
    heatmap.index = list(habits.keys())

    fig, ax = plt.subplots(figsize=(10, 3.8))
    image = ax.imshow(heatmap.values, aspect="auto", cmap="Greens", vmin=0, vmax=1)
    ax.set_title(title)
    ax.set_xticks(range(len(heatmap.columns)))
    ax.set_xticklabels(heatmap.columns, rotation=45, ha="right")
    ax.set_yticks(range(len(heatmap.index)))
    ax.set_yticklabels(heatmap.index)
    fig.colorbar(image, ax=ax, ticks=[0, 1], label="Done")
    save_chart(fig, filename)


def chart_roadmap_progress_by_area(items):
    filename = "roadmap_progress_by_area.png"
    title = "Roadmap Progress by Area"
    df = pd.DataFrame(items)

    if df.empty:
        save_empty_chart(filename, title)
        return

    for column, default in {"area": "Unknown", "status": "Not Started"}.items():
        if column not in df.columns:
            df[column] = default
        df[column] = df[column].fillna(default)

    grouped = df.groupby("area")["status"].apply(lambda status: (status == "Done").mean() * 100)

    fig, ax = plt.subplots(figsize=(8, 4.8))
    grouped.sort_values().plot(kind="barh", ax=ax, color="#2dd4bf")
    ax.set_title(title)
    ax.set_xlabel("Done (%)")
    ax.set_xlim(0, 100)
    save_chart(fig, filename)


def chart_project_statuses(projects):
    filename = "project_statuses.png"
    title = "Project Statuses"
    df = pd.DataFrame(projects)

    if df.empty:
        save_empty_chart(filename, title)
        return

    if "status" not in df.columns:
        df["status"] = "Unknown"

    status_counts = df["status"].fillna("Unknown").value_counts()

    fig, ax = plt.subplots(figsize=(8, 4.8))
    ax.bar(status_counts.index, status_counts.values, color="#a78bfa")
    ax.set_title(title)
    ax.set_xlabel("Status")
    ax.set_ylabel("Projects")
    ax.tick_params(axis="x", rotation=30)
    save_chart(fig, filename)


def main():
    data = load_data()
    daily_df = prepare_daily_entries(data["dailyEntries"])

    chart_pomodoro_per_day(daily_df)
    chart_weekly_pomodoro(daily_df)
    chart_mood_energy_over_time(daily_df)
    chart_habit_heatmap(daily_df)
    chart_roadmap_progress_by_area(data["roadmapItems"])
    chart_project_statuses(data["projects"])

    print("Done. Charts are saved in analytics/charts and public/charts.")


if __name__ == "__main__":
    main()
