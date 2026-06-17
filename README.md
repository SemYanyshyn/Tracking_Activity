# Dev Summer Tracker

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud%20Sync-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-222222?logo=github&logoColor=white)](https://pages.github.com/)

Dev Summer Tracker is a personal productivity dashboard for tracking summer learning progress, frontend/fullstack growth, daily habits, project work, and job preparation.

The app helps track React learning, project progress, English practice, movement, Pomodoro count, mood, energy, daily results, tomorrow focus, and notes. Daily progress records can sync across devices using Supabase, while local JSON export/import remains available as a backup.

The React/Vite app is located in [`dev-summer-tracker`](./dev-summer-tracker).

## Live Demo

[Open Dev Summer Tracker](https://semyanyshyn.github.io/Tracking_Activity/)

## Features

- Daily progress tracking
- Habit checkboxes for React, Project, English, and Movement
- Pomodoro count tracking
- Mood and Energy tracking
- Main result, tomorrow focus, and notes fields
- Edit and delete daily records
- Dashboard with weekly statistics
- Project tracker
- Learning roadmap tracker
- Weekly review tracker
- Export Data and Import Data JSON backup
- Supabase cloud sync for daily progress records
- GitHub Pages deployment with GitHub Actions
- Responsive dark UI for desktop and mobile

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Supabase
- localStorage
- GitHub Pages
- GitHub Actions

## Screenshots

Screenshots will be added later.

Suggested screenshots:

- Dashboard view
- Daily Tracker form
- Projects tab
- Roadmap tab
- Weekly Review tab
- Mobile layout

Placeholder paths:

```text
docs/screenshots/dashboard.png
docs/screenshots/daily-tracker.png
docs/screenshots/mobile.png
```

## Supabase Setup

Create a Supabase project and add a table named `daily_entries`.

Recommended table columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key from the app |
| `date` | `date` | Daily entry date |
| `react_done` | `boolean` | React learning checkbox |
| `project_done` | `boolean` | Project work checkbox |
| `english_done` | `boolean` | English checkbox |
| `movement_done` | `boolean` | Gym / walk / movement checkbox |
| `pomodoro_count` | `integer` | Number of Pomodoros |
| `mood` | `integer` | Mood score from 1 to 10 |
| `energy` | `integer` | Energy score from 1 to 10 |
| `main_result` | `text` | Main result of the day |
| `tomorrow_focus` | `text` | Focus for tomorrow |
| `notes` | `text` | Extra notes |
| `created_at` | `timestamptz` | Created timestamp |
| `updated_at` | `timestamptz` | Updated timestamp |

The detailed Supabase SQL setup is documented in [`dev-summer-tracker/SUPABASE_SETUP.md`](./dev-summer-tracker/SUPABASE_SETUP.md).

Important security note:

- This project does not use authentication.
- Do not use a Supabase `service_role` key in the frontend.
- Use only the Supabase anon public key.
- For a real private app, add authentication and Row Level Security policies.

## Environment Variables

Create a local `.env` file from `.env.example`:

```bash
cd dev-summer-tracker
cp .env.example .env
```

Then fill in your Supabase values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit `.env`.

The `.env` file contains local secrets/configuration and must stay ignored by Git. The project includes [`dev-summer-tracker/.env.example`](./dev-summer-tracker/.env.example) as a safe template for other environments.

## Local Setup

Open the app folder:

```bash
cd dev-summer-tracker
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Optional preview after build:

```bash
npm run preview
```

## Deployment

The app is deployed to GitHub Pages using GitHub Actions.

The GitHub Actions build step must receive these repository secrets:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

In GitHub:

1. Open the repository.
2. Go to Settings.
3. Open Secrets and variables.
4. Open Actions.
5. Add both secrets.
6. Push to the `main` branch.
7. Wait for the GitHub Actions deploy workflow to finish.

The Vite config uses the correct base path for GitHub Pages deployment.

## Project Status

Status: active personal learning project.

Implemented:

- Core tracker UI
- Daily Tracker CRUD
- Dashboard statistics
- Projects, Roadmap, and Weekly Review sections
- Local JSON backup
- Supabase sync for daily progress records
- GitHub Pages deployment
- Responsive dark design

Planned improvements:

- Add authentication for private cloud sync
- Improve analytics charts in the UI
- Add screenshots to this README
- Add more automated tests

## What I Learned

This project helped me practice:

- Building a React app with reusable components
- Managing form state and validation
- Saving and loading data from localStorage
- Importing and exporting JSON backups
- Connecting a frontend app to Supabase
- Using environment variables safely in Vite
- Deploying a Vite app to GitHub Pages
- Automating deployment with GitHub Actions
- Improving responsive UI with plain CSS
