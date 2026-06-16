# Dev Summer Tracker Analytics

This folder contains a small Python analytics script for exported Dev Summer Tracker data.

## Files

- `progress_data.json` - place your exported app data here.
- `generate_charts.py` - reads the JSON file and creates charts.
- `charts/` - generated PNG charts are saved here.
- `../public/charts/` - generated PNG charts are also copied here so the React app can display them.

## Expected JSON structure

```json
{
  "dailyEntries": [],
  "projects": [],
  "roadmapItems": [],
  "weeklyReviews": []
}
```

The app export can also include `exportedAt`; the script safely ignores extra fields.

## Setup

Install dependencies:

```bash
pip install pandas matplotlib
```

## Usage

1. Export data from the app.
2. Save or rename the exported file as:

```text
analytics/progress_data.json
```

3. Run:

```bash
python analytics/generate_charts.py
```

Charts will be created in:

```text
analytics/charts
public/charts
```

When the Vite app is running, the Dashboard can display charts from:

```text
http://localhost:5173/charts/pomodoro_per_day.png
```

If the Dashboard still shows empty chart placeholders, run the script again and refresh the browser page.

## Generated charts

- `pomodoro_per_day.png`
- `weekly_pomodoro.png`
- `mood_energy_over_time.png`
- `habit_heatmap.png`
- `roadmap_progress_by_area.png`
- `project_statuses.png`
