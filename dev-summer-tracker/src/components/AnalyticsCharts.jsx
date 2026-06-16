import { useState } from 'react'

const chartFiles = [
  {
    filename: 'pomodoro_per_day.png',
    title: 'Pomodoro per day',
  },
  {
    filename: 'weekly_pomodoro.png',
    title: 'Weekly pomodoro',
  },
  {
    filename: 'mood_energy_over_time.png',
    title: 'Mood and energy',
  },
  {
    filename: 'habit_heatmap.png',
    title: 'Habit heatmap',
  },
  {
    filename: 'roadmap_progress_by_area.png',
    title: 'Roadmap progress',
  },
  {
    filename: 'project_statuses.png',
    title: 'Project statuses',
  },
]

function ChartCard({ chart }) {
  const [hasError, setHasError] = useState(false)

  return (
    <article className="chart-card">
      <div>
        <p className="section-label">Chart</p>
        <h3>{chart.title}</h3>
      </div>

      {hasError ? (
        <div className="chart-missing">
          Chart is not generated yet. Export your data, save it as
          analytics/progress_data.json, then run python3
          analytics/generate_charts.py.
        </div>
      ) : (
        <img
          alt={`${chart.title} chart`}
          src={`/charts/${chart.filename}`}
          onError={() => setHasError(true)}
        />
      )}
    </article>
  )
}

function AnalyticsCharts() {
  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <div>
          <p className="section-label">Analytics</p>
          <h2>Python charts</h2>
        </div>
        <p>
          Export your data as JSON, save it to analytics/progress_data.json, run
          the Python script, then refresh this page.
        </p>
      </div>

      <div className="analytics-grid">
        {chartFiles.map((chart) => (
          <ChartCard key={chart.filename} chart={chart} />
        ))}
      </div>
    </section>
  )
}

export default AnalyticsCharts
