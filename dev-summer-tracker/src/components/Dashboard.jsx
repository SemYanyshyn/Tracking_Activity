import {
  average,
  countUniqueDoneDays,
  formatWeekRange,
  getCurrentWeekRange,
  getLatestText,
  isEntryInWeek,
} from '../data.js'
import AnalyticsCharts from './AnalyticsCharts.jsx'

function StatCard({ title, value, detail, progress }) {
  return (
    <article className="stat-card">
      <p>{title}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
      {progress !== null && (
        <div className="progress-bar" aria-label={`${title} progress`}>
          <span style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      )}
    </article>
  )
}

function Dashboard({ entries }) {
  const weekRange = getCurrentWeekRange()
  const weekEntries = entries.filter((entry) => isEntryInWeek(entry, weekRange))
  const hasWeekData = weekEntries.length > 0
  const reactDays = countUniqueDoneDays(weekEntries, 'reactDone')
  const projectDays = countUniqueDoneDays(weekEntries, 'projectDone')
  const englishDays = countUniqueDoneDays(weekEntries, 'englishDone')
  const movementDays = countUniqueDoneDays(weekEntries, 'movementDone')
  const totalPomodoros = weekEntries.reduce(
    (sum, entry) => sum + Number(entry.pomodoros),
    0,
  )
  const averageMood = average(weekEntries, 'mood')
  const averageEnergy = average(weekEntries, 'energy')
  const latestMainResult = getLatestText(weekEntries, 'mainResult')
  const tomorrowFocus = getLatestText(weekEntries, 'tomorrowFocus')

  const stats = [
    {
      title: 'React days this week',
      value: hasWeekData ? `${reactDays}/7` : 'No data',
      detail: 'days checked',
      progress: hasWeekData ? (reactDays / 7) * 100 : null,
    },
    {
      title: 'Pet Project days this week',
      value: hasWeekData ? `${projectDays}/7` : 'No data',
      detail: 'days checked',
      progress: hasWeekData ? (projectDays / 7) * 100 : null,
    },
    {
      title: 'English days this week',
      value: hasWeekData ? `${englishDays}/7` : 'No data',
      detail: 'days checked',
      progress: hasWeekData ? (englishDays / 7) * 100 : null,
    },
    {
      title: 'Gym / Walk days this week',
      value: hasWeekData ? `${movementDays}/7` : 'No data',
      detail: 'days checked',
      progress: hasWeekData ? (movementDays / 7) * 100 : null,
    },
    {
      title: 'Total Pomodoro this week',
      value: hasWeekData ? totalPomodoros : 'No data',
      detail: 'focus sessions',
      progress: null,
    },
    {
      title: 'Average Mood this week',
      value: averageMood === null ? 'No data' : `${averageMood}/10`,
      detail: 'average score',
      progress: averageMood === null ? null : averageMood * 10,
    },
    {
      title: 'Average Energy this week',
      value: averageEnergy === null ? 'No data' : `${averageEnergy}/10`,
      detail: 'average score',
      progress: averageEnergy === null ? null : averageEnergy * 10,
    },
  ]

  return (
    <section className="dashboard-tab">
      <div className="tab-heading">
        <p className="section-label">Dashboard</p>
        <h2>Current week statistics</h2>
        <p className="placeholder-text">{formatWeekRange(weekRange)}</p>
      </div>

      <article className="goal-card">
        <p className="section-label">Main goal</p>
        <h3>
          Finish React basics, build 2-3 portfolio projects, improve English,
          and prepare for front-end offers by late August / early September.
        </h3>
      </article>

      {!hasWeekData && (
        <div className="dashboard-empty">
          No Daily Tracker entries for the current week yet. Add an entry to see
          weekly statistics here.
        </div>
      )}

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="insight-grid">
        <article className="insight-card">
          <p className="section-label">Latest Main Result</p>
          <h3>{latestMainResult || 'No main result this week yet.'}</h3>
        </article>
        <article className="insight-card">
          <p className="section-label">Tomorrow Focus</p>
          <h3>{tomorrowFocus || 'No tomorrow focus this week yet.'}</h3>
        </article>
      </div>

      <AnalyticsCharts />
    </section>
  )
}

export default Dashboard
